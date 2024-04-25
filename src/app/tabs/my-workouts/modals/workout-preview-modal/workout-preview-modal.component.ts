import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonTitle,
  IonButton,
} from '@ionic/angular/standalone';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';

@Component({
  selector: 'app-workout-preview-modal',
  templateUrl: './workout-preview-modal.component.html',
  styleUrls: ['./workout-preview-modal.component.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonTitle],
})
export class WorkoutPreviewModalComponent implements OnInit {
  workoutData!: IWorkoutData;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log('Workout Data Passed: ', this.workoutData);
  }

  onCancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  onSave() {
    return this.modalCtrl.dismiss(this.workoutData, 'confirm');
  }
}
