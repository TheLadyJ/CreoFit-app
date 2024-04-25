import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IWorkoutData } from '../interfaces/WorkoutData';
import { AuthService } from './auth.service';

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
        console.log(res);
        console.log(res.id);
      });
    // let workoutId =
    // await this.firestore
    //   .collection('users')
    //   .doc(this.authService.getCurrentUser()?.uid)
    //   .set({
    //     createdWorkouts: [...createdWorkouts,workoutData.workoutId],
    //   });
  }
}
