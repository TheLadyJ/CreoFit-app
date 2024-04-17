import { IExercise } from './IExercise';

export interface IExerciseData {
  exercise: IExercise;
  reps?: number;
  duration?: {
    min?: number;
    sec?: number;
  };
}
