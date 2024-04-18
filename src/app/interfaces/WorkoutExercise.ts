import { IExercise } from './ExercisesDB';

export interface IExerciseData {
  break: boolean;
  exercise: IExercise;
  reps?: number;
  duration?: {
    min?: number;
    sec?: number;
  };
}
