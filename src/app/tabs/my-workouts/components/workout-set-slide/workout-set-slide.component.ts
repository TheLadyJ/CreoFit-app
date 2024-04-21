import { Component, Input, OnInit } from '@angular/core';
import { ISetData } from 'src/app/interfaces/WorkoutData';
import {
  IonList,
  IonItem,
  IonRow,
  IonLabel,
  IonCol,
  IonIcon,
  IonButton,
  IonCard,
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-workout-set-slide',
  templateUrl: './workout-set-slide.component.html',
  styleUrls: ['./workout-set-slide.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonButton,
    IonIcon,
    IonCol,
    IonLabel,
    IonRow,
    IonItem,
    IonList,
  ],
})
export class WorkoutSetSlideComponent implements OnInit {
  @Input() workoutSet!: ISetData;

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {}

  getDurationMinSec(date: Date) {
    return this.datePipe.transform(date, 'mm:ss');
  }
}
