import { IExercise } from './ExercisesDB';

export interface IExerciseData {
  break: boolean;
  exercise?: IExercise | null;
  reps?: number | null;
  duration?: Date | null;
}

export interface ISetData {
  exercisesData: IExerciseData[];
  repeting: number;
}

export interface IWorkoutData {
  setData: ISetData[];
}
