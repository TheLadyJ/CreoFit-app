import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonThumbnail,
  IonText,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
  IonSearchbar,
  IonModal,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, options } from 'ionicons/icons';
import { AddWorkoutModalComponent } from './add-workout-modal/add-workout-modal.component';

@Component({
  selector: 'app-my-workouts',
  templateUrl: './my-workouts.page.html',
  styleUrls: ['./my-workouts.page.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonSearchbar,
    IonCol,
    IonRow,
    IonIcon,
    IonButton,
    IonText,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonThumbnail,
    AddWorkoutModalComponent,
  ],
})
export class MyWorkoutsPage implements OnInit {
  constructor() {
    addIcons({ addOutline, options });
  }

  presentingElement = null;

  ngOnInit() {}

  onAddWorkout() {}
}