import { Component, Input, OnInit } from '@angular/core';
import { ISetData, IWorkoutData } from 'src/app/interfaces/WorkoutData';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonTitle,
  IonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { OrdinalPipe } from 'src/app/pipes/ordinal.pipe';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html',
  styleUrls: ['./sets.component.scss'],
  standalone: true,
  imports: [
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

  constructor() {}

  ngOnInit() {
    console.log(this.workout);
  }
  changeSegment(event: any) {
    this.current_set = event.detail.value;
  }

  getDurationString(duration: any) {
    let durString = '';
    if (duration.getMinutes()) {
      durString += duration.getMinutes() + ' min';
    }
    if (duration.getSeconds()) {
      if (!durString) {
        durString += '';
      }
      durString += duration.getSeconds() + ' sec';
    }
    return durString;
  }
}
