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
import { AddWorkoutModalComponent } from './modals/add-workout-modal/add-workout-modal.component';
import { AddSetModalComponent } from './modals/add-set-modal/add-set-modal.component';
import { AddExerciseModalComponent } from './modals/add-exercise-modal/add-exercise-modal.component';
import { ExerciesService } from 'src/app/services/exercies.service';
import { ModalController } from '@ionic/angular/standalone';

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
    AddSetModalComponent,
    AddExerciseModalComponent,
  ],
})
export class MyWorkoutsPage implements OnInit {
  isAddSetModalOpen = false;
  isAddExerciseModalOpen = false;
  presentingElement: any = null;
  workoutData = 'Initial workout data';

  // public exercisesService: ExerciesService
  constructor(private modalCtrl: ModalController) {
    addIcons({ addOutline, options });
  }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  async openAddWorkoutModal() {
    const modal = await this.modalCtrl.create({
      component: AddWorkoutModalComponent,
      cssClass: 'addWorkoutModal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.workoutData = `Hello, ${data}!`;
    }
    console.log(this.workoutData);
  }
}
