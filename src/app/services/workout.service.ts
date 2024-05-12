import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BodyPart, IWorkoutData } from '../interfaces/WorkoutData';
import { AuthService } from './auth.service';
import { arrayUnion, increment } from '@angular/fire/firestore';
import { Observable, catchError, from, map, of, switchMap, take } from 'rxjs';
import { IUser } from '../interfaces/User';
import { Equipment } from '../interfaces/ExercisesDB';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private firestore = inject(AngularFirestore);
  constructor(private authService: AuthService) {}

  async updateWorkout(workoutData: IWorkoutData) {
    if (workoutData.id) {
      await this.firestore
        .collection('workouts')
        .doc(workoutData.id)
        .update(workoutData);
    }
  }

  async addWorkout(workoutData: IWorkoutData): Promise<any> {
    await this.firestore
      .collection('workouts')
      .add(workoutData)
      .then((res) => {
        this.firestore.collection('workouts').doc(res.id).update({
          id: res.id,
        });
      });
  }

  convertTimestampsToDate(data: any) {
    const stack = [data];

    while (stack.length) {
      const current = stack.pop();

      if (current !== null && typeof current === 'object') {
        Object.keys(current).forEach((key) => {
          const value = current[key];
          if (value && typeof value === 'object') {
            if (
              'seconds' in value &&
              'nanoseconds' in value &&
              Object.keys(value).length === 2
            ) {
              current[key] = new Date(
                value.seconds * 1000 + value.nanoseconds / 1000000
              );
            } else {
              stack.push(value);
            }
          }
        });
      }
    }
    return data;
  }

  getMyWorkouts(): Observable<IWorkoutData[]> {
    const thisUserId = this.authService.getCurrentUser()?.uid;
    return this.firestore
      .collection('workouts', (ref) => ref.where('userId', '==', thisUserId))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: IWorkoutData = a.payload.doc.data() as IWorkoutData;
            const convertedData = this.convertTimestampsToDate(data);
            const id = a.payload.doc.id;
            return { id, ...convertedData };
          })
        )
      );
  }

  getSavedWorkouts(
    workoutTitle: string | null = null,
    bodyPart: BodyPart | null = null,
    minDuration: Date | null = null,
    maxDuration: Date | null = null,
    equipmentUsed: Equipment[] | null = null,
    currentPage: number,
    itemsPerPage: number,
    orderBy: string | null = null
  ): Observable<IWorkoutData[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.uid) {
      return of([]); // Return an empty observable if there is no user
    }

    return this.firestore
      .collection('users')
      .doc<IUser>(currentUser.uid)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          const userData = snapshot.payload.data() as IUser | undefined;
          if (!userData) {
            return [];
          }
          const savedWorkoutIds: string[] = userData.savedWorkouts || [];
          return savedWorkoutIds;
        }),
        switchMap((savedWorkoutIds) => {
          if (savedWorkoutIds.length > 0) {
            return this.firestore
              .collection('workouts', (ref) => {
                let filteredQuery:
                  | firebase.default.firestore.CollectionReference
                  | firebase.default.firestore.Query = ref;

                filteredQuery = filteredQuery.where(
                  'id',
                  'in',
                  savedWorkoutIds
                );

                if (workoutTitle) {
                  filteredQuery = filteredQuery.where(
                    'title',
                    '==',
                    workoutTitle
                  );
                }
                if (bodyPart) {
                  filteredQuery = filteredQuery.where(
                    'bodyPart',
                    '==',
                    bodyPart
                  );
                }
                if (minDuration) {
                  filteredQuery = filteredQuery.where(
                    'totalDuration',
                    '>=',
                    minDuration
                  );
                }
                if (maxDuration) {
                  filteredQuery = filteredQuery.where(
                    'totalDuration',
                    '<=',
                    maxDuration
                  );
                }

                if (equipmentUsed && equipmentUsed.length > 0) {
                  filteredQuery = filteredQuery.where(
                    'equipment_used',
                    'array-contains-any',
                    equipmentUsed
                  );
                }
                if (orderBy) {
                  filteredQuery = filteredQuery.orderBy(orderBy, 'desc');
                }

                return filteredQuery;
              })
              .snapshotChanges()
              .pipe(
                map((actions) =>
                  actions
                    .map((a) => {
                      const data: IWorkoutData =
                        a.payload.doc.data() as IWorkoutData;
                      const convertedData = this.convertTimestampsToDate(data);
                      const id = a.payload.doc.id;
                      return { id, ...convertedData };
                    })
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      (currentPage - 1) * itemsPerPage + itemsPerPage
                    )
                )
              );
          } else {
            return of([]);
          }
        })
      );
  }

  getPopularWorkouts(limit = 5): Observable<IWorkoutData[]> {
    const thisUserId = this.authService.getCurrentUser()?.uid;
    return from(
      this.firestore
        .collection('workouts', (ref) => ref.where('isPublic', '==', true))
        .get()
        .pipe(
          map((snapshot) => {
            const workouts = snapshot.docs
              .map((doc) => {
                const data: IWorkoutData = doc.data() as IWorkoutData;
                const convertedData = this.convertTimestampsToDate(data);
                const id = doc.id;
                return { id, ...convertedData };
              })
              .filter((workout) => workout.userId !== thisUserId)
              .sort((a, b) => b.savedCount - a.savedCount)
              .slice(0, limit);

            return workouts;
          })
        )
    );
  }

  getRecentWorkouts(limit = 5): Observable<IWorkoutData[]> {
    const thisUserId = this.authService.getCurrentUser()?.uid;
    return from(
      this.firestore
        .collection('workouts', (ref) => ref.where('isPublic', '==', true))
        .get()
        .pipe(
          map((snapshot) => {
            const workouts = snapshot.docs
              .map((doc) => {
                const data: IWorkoutData = doc.data() as IWorkoutData;
                const convertedData = this.convertTimestampsToDate(data);
                const id = doc.id;
                return { id, ...convertedData };
              })
              .filter((workout) => workout.userId !== thisUserId)
              .sort((a, b) => b.date_created - a.date_created)
              .slice(0, limit);

            return workouts;
          })
        )
    );
  }

  getWorkoutById(id: string): Observable<IWorkoutData> {
    return this.firestore
      .collection('workouts')
      .doc(id)
      .valueChanges()
      .pipe(
        map((workout: any) => {
          if (workout) {
            const convertedWorkoutData = this.convertTimestampsToDate(workout);
            return {
              id: convertedWorkoutData.id,
              userId: convertedWorkoutData.userId,
              title: convertedWorkoutData.title,
              description: convertedWorkoutData.description,
              bodyPart: convertedWorkoutData.bodyPart,
              isPublic: convertedWorkoutData.isPublic,
              restBetweenSets: convertedWorkoutData.restBetweenSets,
              totalDuration: convertedWorkoutData.totalDuration,
              setData: convertedWorkoutData.setData || [],
              savedCount: convertedWorkoutData.savedCount,
              date_created: convertedWorkoutData.date_created,
              equipment_used: convertedWorkoutData.equipment_used || [],
            };
          } else {
            return {
              id: '',
              userId: '',
              title: '',
              description: '',
              bodyPart: '',
              isPublic: null,
              restBetweenSets: null,
              totalDuration: null,
              setData: [],
              savedCount: 0,
              date_created: null,
              equipment_used: [],
            };
          }
        })
      );
  }

  updateSavedWorkouts(workoutId: string) {
    const currentUserId = this.authService.getCurrentUser()?.uid;

    if (!currentUserId) {
      // Handle case when current user is not available
      return;
    }

    const userRef = this.firestore
      .collection('users')
      .doc(currentUserId)
      .snapshotChanges();

    userRef
      .pipe(
        take(1),
        switchMap((userDoc) => {
          if (userDoc.payload.exists) {
            const userData = userDoc.payload.data() as IUser;
            if (userData) {
              let savedWorkouts: string[] = userData.savedWorkouts || [];

              const index = savedWorkouts.indexOf(workoutId);
              if (index !== -1) {
                // Workout is already saved, remove it
                savedWorkouts.splice(index, 1);
                // Reduce the savedCount for that workout
                const decrementSavedCount = increment(-1);
                this.firestore
                  .collection('workouts')
                  .doc(workoutId)
                  .update({ savedCount: decrementSavedCount });
              } else {
                // Workout is not saved, add it
                savedWorkouts.push(workoutId);
                // Increase the savedCount for that workout
                const incrementSavedCount = increment(1);
                this.firestore
                  .collection('workouts')
                  .doc(workoutId)
                  .update({ savedCount: incrementSavedCount });
              }

              // Update savedWorkouts field in Firestore
              return this.firestore
                .collection('users')
                .doc(currentUserId)
                .update({ savedWorkouts });
            }
          } else {
            console.log("User document doesn't exist");
          }
          return [];
        })
      )
      .subscribe(
        () => {
          console.log('Updated saved workouts successfully');
        },
        (error) => {
          console.error('Error updating saved workouts:', error);
        }
      );
  }

  isWorkoutSaved(id: string): Observable<boolean> {
    const currentUserId = this.authService.getCurrentUser()?.uid;

    if (!currentUserId) {
      // Handle case when current user is not available
      return new Observable<boolean>((observer) => {
        observer.next(false); // Current user not available, emit false
        observer.complete();
      });
    }

    return this.firestore
      .collection('users')
      .doc<IUser>(currentUserId)
      .valueChanges()
      .pipe(
        map((userData) => {
          if (userData) {
            const savedWorkouts: string[] = userData.savedWorkouts || [];
            return savedWorkouts.includes(id);
          } else {
            return false; // User data not available, emit false
          }
        })
      );
  }

  getSavedCount(id: string) {
    return this.firestore
      .collection('workouts')
      .doc<IWorkoutData>(id)
      .valueChanges()
      .pipe(
        map((workoutData) => {
          if (workoutData) {
            return workoutData.savedCount;
          } else {
            return -1;
          }
        })
      );
  }

  filterWorkouts(
    workoutTitle: string | null = null,
    bodyPart: BodyPart | null = null,
    minDuration: Date | null = null,
    maxDuration: Date | null = null,
    equipmentUsed: Equipment[] | null = null,
    currentPage: number,
    itemsPerPage: number,
    workoutIsMine: boolean | null = null,
    workoutIsPublic: boolean | null = null,
    orderBy: string | null = null
  ): Observable<IWorkoutData[]> {
    return this.firestore
      .collection('workouts', (ref) => {
        let filteredQuery:
          | firebase.default.firestore.CollectionReference
          | firebase.default.firestore.Query = ref;
        const thisUserId = this.authService.getCurrentUser()?.uid;

        if (workoutTitle) {
          filteredQuery = filteredQuery.where('title', '==', workoutTitle);
        }
        if (bodyPart) {
          filteredQuery = filteredQuery.where('bodyPart', '==', bodyPart);
        }
        if (minDuration) {
          filteredQuery = filteredQuery.where(
            'totalDuration',
            '>=',
            minDuration
          );
        }
        if (maxDuration) {
          filteredQuery = filteredQuery.where(
            'totalDuration',
            '<=',
            maxDuration
          );
        }

        if (equipmentUsed && equipmentUsed.length > 0) {
          filteredQuery = filteredQuery.where(
            'equipment_used',
            'array-contains-any',
            equipmentUsed
          );
        }

        if (workoutIsMine != null) {
          if (workoutIsMine) {
            filteredQuery = filteredQuery.where('userId', '==', thisUserId);
          } else {
            filteredQuery = filteredQuery.where('userId', '!=', thisUserId);
          }
        }
        if (workoutIsPublic) {
          filteredQuery = filteredQuery.where(
            'isPublic',
            '==',
            workoutIsPublic
          );
        }
        if (orderBy) {
          filteredQuery = filteredQuery.orderBy(orderBy, 'desc');
        }

        return filteredQuery;
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions
            .map((a) => {
              const data: IWorkoutData = a.payload.doc.data() as IWorkoutData;
              const convertedData = this.convertTimestampsToDate(data);
              const id = a.payload.doc.id;
              return { id, ...convertedData };
            })
            .slice(
              (currentPage - 1) * itemsPerPage,
              (currentPage - 1) * itemsPerPage + itemsPerPage
            )
        )
      );
  }

  deleteWorkout = async (workout: IWorkoutData) => {
    try {
      // Fetch all users
      const usersQuerySnapshot = await this.firestore.collection('users');
      usersQuerySnapshot.get().forEach((userDoc) => {
        const userData = userDoc.docs[0].data() as IUser;

        if (
          workout.id &&
          workout.isPublic &&
          userData &&
          userData.savedWorkouts &&
          userData.savedWorkouts.includes(workout.id)
        ) {
          // Remove workoutId from savedWorkouts array
          const updatedSavedWorkouts = userData.savedWorkouts.filter(
            (id: string) => id !== workout.id
          );
          // Update the user document with the modified savedWorkouts array
          const userRef = usersQuerySnapshot.doc(userDoc.docs[0].id).update({
            savedWorkouts: updatedSavedWorkouts,
          });
        }
      });

      console.log('WorkoutId removed from savedWorkouts for all users.');
    } catch (error) {
      console.error('Error removing workoutId from savedWorkouts:', error);
    }
    try {
      if (workout.id) {
        this.firestore.collection('workouts').doc(workout.id).delete();
        console.log('Workout removed from workouts collection.');
      }
    } catch (error) {
      console.error('Error removing workout from workouts collection:', error);
    }
  };
}
