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

@Injectable({
  providedIn: 'root',
})
export class ExerciesService {
  private http = inject(HttpClient);
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
          this.exercisesSubject.next(exercises);
        },
        error: (error) => {
          console.error('Error fetching exercises:', error);
        },
      });
  }

  public filterExercises(
    name: string,
    muscleUsed: Muscle,
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
          filteredExercises = filteredExercises.filter(
            (exercise) =>
              exercise.primaryMuscles.some((pm) => pm == muscleUsed) ||
              exercise.secondaryMuscles.some((pm) => pm == muscleUsed)
          );
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
