import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Category,
  Equipment,
  IExercise,
  Level,
  Muscle,
} from '../interfaces/ExercisesDB';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ExerciesService {
  private http = inject(HttpClient);
  private storage = inject(Storage);
  private exercisesSubject: BehaviorSubject<IExercise[]> = new BehaviorSubject<
    IExercise[]
  >([]);
  public exercises$ = this.exercisesSubject.asObservable();

  private fetchError: any;

  constructor() {
    this.fetchExercises();
  }

  private fetchExercises() {
    this.http
      .get<IExercise[]>('assets/exercises.json')
      .pipe(
        catchError((error) => {
          console.error('Error fetching exercises:', error);
          this.fetchError = error;
          return [];
        })
      )
      .subscribe({
        next: (exercises) => {
          try {
            exercises.forEach((exercise) => {
              this.setExerciseGif(exercise);
            });
            console.log('All gifs set');
          } catch (err) {
            console.log('Error while setting gifs: ' + err);
          }
          this.exercisesSubject.next(exercises);
        },
        error: (error) => {
          console.error('Error fetching exercises:', error);
        },
      });
  }

  setExerciseGif(exercise: IExercise) {
    const file_name = exercise.id + '\\exercise.gif';
    this.getGifByName(file_name).then((gif) => {
      exercise.gif = gif;
    });
  }

  getGifByName(gifName: string): Promise<string | null> {
    const gifRef = ref(this.storage, gifName);
    return getDownloadURL(gifRef);
  }

  public filterExercises(
    name: string,
    muscleUsed: Muscle,
    secondaryMusclesIncluded: boolean,
    equipment: Equipment,
    category: Category,
    level: Level,
    currentPage: number,
    itemsPerPage: number
  ): Observable<IExercise[]> {
    return this.exercises$.pipe(
      map((exercises) => {
        if (exercises.length === 0 && this.fetchError) {
          throw this.fetchError;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        let filteredExercises = exercises;
        if (name) {
          filteredExercises = filteredExercises.filter((exercise) =>
            exercise.name.toLowerCase().includes(name.toLowerCase())
          );
        }
        if (muscleUsed) {
          if (secondaryMusclesIncluded) {
            filteredExercises = filteredExercises.filter(
              (exercise) =>
                exercise.primaryMuscles.some((pm) => pm == muscleUsed) ||
                exercise.secondaryMuscles.some((pm) => pm == muscleUsed)
            );
          } else {
            filteredExercises = filteredExercises.filter((exercise) =>
              exercise.primaryMuscles.some((pm) => pm == muscleUsed)
            );
          }
        }
        if (equipment) {
          filteredExercises = filteredExercises.filter(
            (exercise) =>
              exercise.equipment?.toLowerCase() === equipment.toLowerCase()
          );
        }
        if (category) {
          filteredExercises = filteredExercises.filter(
            (exercise) =>
              exercise.category.toLowerCase() === category.toLowerCase()
          );
        }
        if (level) {
          filteredExercises = filteredExercises.filter(
            (exercise) => exercise.level.toLowerCase() === level.toLowerCase()
          );
        }

        return filteredExercises.slice(startIndex, endIndex);
      }),
      catchError((error) => {
        console.error('Error filtering exercises:', error);
        return throwError(
          'Failed to filter exercises. Please try again later.'
        );
      })
    );
  }
}
