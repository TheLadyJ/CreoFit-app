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

  public bodyParts = [
    { value: 'back', name: 'Back' },
    { value: 'cardio', name: 'Cardio' },
    { value: 'chest', name: 'Chest' },
    { value: 'lower arms', name: 'Lower arms' },
    { value: 'lower legs', name: 'Lower legs' },
    { value: 'neck', name: 'Neck' },
    { value: 'shoulders', name: 'Shoulders' },
    { value: 'upper arms', name: 'Upper arms' },
    { value: 'upper legs', name: 'Upper legs' },
    { value: 'waist', name: 'Waist' },
  ];

  public equipment = [
    { value: 'assisted', name: 'Assisted' },
    { value: 'band', name: 'Band' },
    { value: 'barbell', name: 'Barbell' },
    { value: 'body weight', name: 'Body weight' },
    { value: 'bosu', name: 'Bosu' },
    { value: 'ball', name: 'Ball' },
    { value: 'cable', name: 'Cable' },
    { value: 'dumbbell', name: 'Dumbbell' },
    { value: 'elliptical machine', name: 'Elliptical machine' },
    { value: 'ez barbell', name: 'Ez barbell' },
    { value: 'hammer', name: 'Hammer' },
    { value: 'kettlebell', name: 'Kettlebell' },
    { value: 'leverage machine', name: 'Leverage machine' },
    { value: 'medicine ball', name: 'Medicine ball' },
    { value: 'olympic barbell', name: 'Olympic barbell' },
    { value: 'resistance band', name: 'Resistance band' },
    { value: 'roller', name: 'Roller' },
    { value: 'rope', name: 'Rope' },
    { value: 'skierg machine', name: 'Skierg machine' },
    { value: 'sled machine', name: 'Sled machine' },
    { value: 'smith machine', name: 'Smith machine' },
    { value: 'stability ball', name: 'Stability ball' },
    { value: 'stationary bike', name: 'Stationary bike' },
    { value: 'stepmill machine', name: 'Stepmill machine' },
    { value: 'tire', name: 'Tire' },
    { value: 'trap bar', name: 'Trap bar' },
    { value: 'upper body ergometer', name: 'Upper body ergometer' },
    { value: 'weighted', name: 'Weighted' },
    { value: 'wheel roller', name: 'Wheel roller' },
  ];

  public targets = [
    { value: 'abductors', name: 'Abductors' },
    { value: 'abs', name: 'Abs' },
    { value: 'adductors', name: 'Adductors' },
    { value: 'biceps', name: 'Biceps' },
    { value: 'calves', name: 'Calves' },
    { value: 'cardiovascular system', name: 'Cardiovascular system' },
    { value: 'delts', name: 'Delts' },
    { value: 'forearms', name: 'Forearms' },
    { value: 'glutes', name: 'Glutes' },
    { value: 'hamstrings', name: 'Hamstrings' },
    { value: 'lats', name: 'Lats' },
    { value: 'levator scapulae', name: 'Levator scapulae' },
    { value: 'pectorals', name: 'Pectorals' },
    { value: 'quads', name: 'Quads' },
    { value: 'serratus anterior', name: 'Serratus anterior' },
    { value: 'spine', name: 'Spine' },
    { value: 'traps', name: 'Traps' },
    { value: 'triceps', name: 'Triceps' },
    { value: 'upper back', name: 'Upper back' },
  ];

  private fetchError: any;

  constructor() {
    this.fetchExercises();
  }

  // private fetchExercises() {
  //   this.http
  //     .get<IExercise[]>(`${BASE_URL}/exercises?limit=2000`, {
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
