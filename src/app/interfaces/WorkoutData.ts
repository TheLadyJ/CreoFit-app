import { Equipment, IExercise } from './ExercisesDB';

export interface IExerciseData {
  break: boolean;
  exercise?: IExercise | null;
  exerciseId?: string;
  reps?: number | null;
  duration?: Date | null;
}

export interface ISetData {
  exercisesData: IExerciseData[];
  repeting: number;
}

export interface IWorkoutData {
  workoutId: string | undefined;
  userId: string | undefined;
  title: string;
  description: string;
  bodyPart: BodyPart;
  isPublic: boolean;
  restBetweenSets: Date;
  totalDuration: Date;
  setData: ISetData[];
  savedCount: number;
  date_created: Date | undefined;
  equipment_used: Equipment[];
}

export enum BodyPart {
  upperBody = 'upper body',
  lowerBody = 'lower body',
  abs = 'abs',
  fullBody = 'full body',
}
