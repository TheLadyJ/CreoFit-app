import { Component, Input, OnInit } from '@angular/core';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  standalone: true,
  imports: [],
})
export class DescriptionComponent implements OnInit {
  @Input() workout!: IWorkoutData;

  constructor() {}

  ngOnInit() {}
}
