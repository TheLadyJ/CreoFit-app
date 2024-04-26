import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IWorkoutData } from '../interfaces/WorkoutData';
import { AuthService } from './auth.service';
import {
  arrayUnion,
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private firestore = inject(AngularFirestore);
  constructor(private authService: AuthService) {}

  async saveWorkout(workoutData: IWorkoutData): Promise<any> {
    await this.firestore
      .collection('workouts')
      .add(workoutData)
      .then((res) => {
        this.firestore
          .collection('users')
          .doc(workoutData.userId)
          .update({
            createdWorkouts: arrayUnion(res.id),
          });
      });
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
            const id = a.payload.doc.id;
            console.log(id);
            console.log(data);
            return { id, ...data };
          })
        )
      );

    // const docRef = this.firestore.doc('workouts').ref;
    // const q = query(
    //   collection(docRef, 'workouts'),
    //   where('userId', '==', thisUserId)
    // );
    // const unsubscribe = onSnapshot(q, (doc) => {
    //   console.log(doc);
    // });
    // this.firestore.collection(querySnapshot).snapshotChanges().subscribe(snapshots => {
    //   snapshots.forEach(snapshot => {
    //     console.log(snapshot.payload.doc.data()); // Logs each workout data
    //   });
    // });
  }
}
