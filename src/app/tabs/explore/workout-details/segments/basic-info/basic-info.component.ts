import { Component, Input, OnInit } from '@angular/core';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { IonText, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbell, bodyOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
  standalone: true,
  imports: [IonIcon, IonText],
})
export class BasicInfoComponent implements OnInit {
  @Input() workout!: IWorkoutData;

  constructor() {
    addIcons({ barbell, bodyOutline, timeOutline });
  }

  ngOnInit() {}

  getDurationString(duration: any) {
    let durString = '';
    if (duration.getHours()) {
      durString += duration.getHours() + ' h';
    }
    if (duration.getMinutes()) {
      if (durString.length > 0) {
        durString += ' ';
      }
      durString += duration.getMinutes() + ' min';
    }
    return durString;
  }
}
