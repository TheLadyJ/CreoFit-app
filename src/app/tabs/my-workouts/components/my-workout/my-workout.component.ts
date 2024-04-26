import { Component, Input, OnInit } from '@angular/core';
import {
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/angular/standalone';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';

@Component({
  selector: 'app-my-workout',
  templateUrl: './my-workout.component.html',
  styleUrls: ['./my-workout.component.scss'],
  standalone: true,
  imports: [IonText, IonCol, IonRow, IonCheckbox, IonLabel, IonItem, IonList],
})
export class MyWorkoutComponent implements OnInit {
  @Input() workout!: IWorkoutData;

  constructor() {}

  ngOnInit() {}

  getDurationString(duration: any) {
    console.log(duration);
    // let durString = '';
    // if (duration.getHours()) {
    //   durString += duration.getHours() + ' h';
    // }
    // if (duration.getMinutes()) {
    //   if (!durString) {
    //     durString += '';
    //   }
    //   durString += duration.getMinutes() + ' min';
    // }
    // return durString;
  }
}
