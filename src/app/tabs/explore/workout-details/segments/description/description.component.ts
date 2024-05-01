import { Component, Input, OnInit } from '@angular/core';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  standalone: true,
  imports: [IonText],
})
export class DescriptionComponent implements OnInit {
  @Input() workout!: IWorkoutData;

  constructor() {}

  ngOnInit() {}
}
