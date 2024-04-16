import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IExercise } from '../interfaces/IExercise';
import { options } from 'ionicons/icons';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { HTTP_HEADERS } from './api-headers';
import * as exercisesData from '../../assets/data.json';

const BASE_URL = 'https://exercisedb.p.rapidapi.com';

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

  // private fetchExercises() {
  //   this.http
  //     .get<IExercise[]>(`${BASE_URL}/exercises`, {
  //       headers: HTTP_HEADERS,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.error('Error fetching exercises:', error);
  //         this.fetchError = error;
  //         return [];
  //       })
  //     )
  //     .subscribe({
  //       next: (exercises) => {
  //         this.exercisesSubject.next(exercises);
  //       },
  //       error: (error) => {
  //         console.error('Error fetching exercises:', error);
  //       },
  //     });
  // }

  private fetchExercises() {
    this.http
      .get<IExercise[]>('assets/data.json')
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
          console.log('EXERCISES FETCHED!');
          console.log(exercises);
        },
        error: (error) => {
          console.error('Error fetching exercises:', error);
        },
      });
  }

  public filterExercises(
    name: string,
    bodyPart: string,
    equipment: string,
    target: string,
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
        if (bodyPart) {
          filteredExercises = filteredExercises.filter(
            (exercise) =>
              exercise.bodyPart.toLowerCase() === bodyPart.toLowerCase()
          );
        }
        if (equipment) {
          filteredExercises = filteredExercises.filter(
            (exercise) =>
              exercise.equipment.toLowerCase() === equipment.toLowerCase()
          );
        }
        if (target) {
          filteredExercises = filteredExercises.filter(
            (exercise) => exercise.target.toLowerCase() === target.toLowerCase()
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
