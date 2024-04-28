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
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, options } from 'ionicons/icons';
import { AddWorkoutModalComponent } from './modals/add-workout-modal/add-workout-modal.component';
import { AddSetModalComponent } from './modals/add-set-modal/add-set-modal.component';
import { AddExerciseModalComponent } from './modals/add-exercise-modal/add-exercise-modal.component';
import { ExerciesService } from 'src/app/services/exercies.service';
import { ModalController } from '@ionic/angular/standalone';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { WorkoutService } from 'src/app/services/workout.service';
import { Observable } from 'rxjs';
import { WorkoutComponent } from './components/workout/workout.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-workouts',
  templateUrl: './my-workouts.page.html',
  styleUrls: ['./my-workouts.page.scss'],
  standalone: true,
  imports: [
    IonCheckbox,
    IonLabel,
    IonItem,
    IonList,
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
    WorkoutComponent,
    RouterModule,
  ],
})
export class MyWorkoutsPage implements OnInit {
  isAddSetModalOpen = false;
  isAddExerciseModalOpen = false;
  presentingElement: any = null;
  workouts$!: Observable<IWorkoutData[]>;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private workoutService: WorkoutService
  ) {
    addIcons({ addOutline, options });
  }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.loadMyWorkouts();
  }

  openAddWorkoutModal = async () => {
    const modal = await this.modalCtrl.create({
      component: AddWorkoutModalComponent,
      cssClass: 'addWorkoutModal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Workout saved');
      this.loadMyWorkouts();
    } else {
      console.log('Workout wasn not saved');
    }
  };

  loadMyWorkouts() {
    this.workouts$ = this.workoutService.getMyWorkouts();
  }
}
