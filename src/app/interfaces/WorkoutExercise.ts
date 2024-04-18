import { IExercise } from './ExercisesDB';

export interface IExerciseData {
  exercise: IExercise;
  reps?: number;
  duration?: {
    min?: number;
    sec?: number;
  };
}
