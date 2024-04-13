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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-my-workouts',
  templateUrl: './my-workouts.page.html',
  styleUrls: ['./my-workouts.page.scss'],
  standalone: true,
  imports: [
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
  ],
})
export class MyWorkoutsPage implements OnInit {
  constructor() {
    addIcons({ addOutline, addCircleOutline });
  }

  ngOnInit() {}
}
