import { Component, Input, OnInit } from '@angular/core';
import { ISetData, IWorkoutData } from 'src/app/interfaces/WorkoutData';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonTitle,
  IonText,
  IonIcon,
  IonChip,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { OrdinalPipe } from 'src/app/pipes/ordinal.pipe';
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { IExercise } from 'src/app/interfaces/ExercisesDB';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html',
  styleUrls: ['./sets.component.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonChip,
    IonIcon,
    IonText,
    IonTitle,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    OrdinalPipe,
  ],
})
export class SetsComponent implements OnInit {
  @Input() workout!: IWorkoutData;
  current_set: number = 1;
  explanationHidden: boolean[][] = [[]];
  gifBaseUrl = '/assets/exercises-gifs/';

  constructor() {
    addIcons({ chevronDownOutline, chevronUpOutline });
  }

  ngOnInit() {
    this.initExplanationHidden();
  }
  changeSegment(event: any) {
    this.current_set = event.detail.value;
  }

  initExplanationHidden() {
    for (let i = 0; i < this.workout.setData.length; i++) {
      let current_set = this.workout.setData[i];
      this.explanationHidden[i] = [];
      if (current_set) {
        for (let j = 0; j < current_set.exercisesData.length; j++) {
          this.explanationHidden[i][j] = true;
        }
      }
    }
  }

  getDurationString(duration: any) {
    let durString = '';
    if (duration.getMinutes()) {
      durString += duration.getMinutes() + ' min';
    }
    if (duration.getSeconds()) {
      if (durString.length > 0) {
        durString += ' ';
      }
      durString += duration.getSeconds() + ' sec';
    }
    return durString;
  }

  toggleHiddenExercise(current_set_index: number, exercise_index: number) {
    this.explanationHidden[current_set_index][exercise_index] =
      !this.explanationHidden[current_set_index][exercise_index];
  }

  isHidden(current_set_index: number, exercise_index: number) {
    return this.explanationHidden[current_set_index][exercise_index];
  }
}
