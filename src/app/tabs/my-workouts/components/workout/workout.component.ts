import { Component, Input, OnInit } from '@angular/core';
import {
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonRow,
  IonCol,
  IonText,
  IonChip,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shareSocialOutline } from 'ionicons/icons';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonChip,
    IonText,
    IonCol,
    IonRow,
    IonCheckbox,
    IonLabel,
    IonItem,
    IonList,
  ],
})
export class WorkoutComponent implements OnInit {
  @Input() workout!: IWorkoutData;
  @Input() myWorkout!: boolean;

  constructor() {
    addIcons({ shareSocialOutline });
  }

  ngOnInit() {}

  getDurationString(duration: any) {
    let durString = '';
    if (duration.getHours()) {
      durString += duration.getHours() + ' h';
    }
    if (duration.getMinutes()) {
      if (!durString) {
        durString += '';
      }
      durString += duration.getMinutes() + ' min';
    }
    return durString;
  }
}
