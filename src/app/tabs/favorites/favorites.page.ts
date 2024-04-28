import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { WorkoutService } from 'src/app/services/workout.service';
import { Observable } from 'rxjs';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { WorkoutComponent } from '../my-workouts/components/workout/workout.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonLabel,
    IonItem,
    IonIcon,
    IonButton,
    IonSearchbar,
    IonCol,
    IonRow,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    WorkoutComponent,
    RouterModule,
  ],
})
export class FavoritesPage implements OnInit {
  savedWorkouts$!: Observable<IWorkoutData[]>;
  isLoading = true;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.loadSavedWorkouts();
  }

  loadSavedWorkouts() {
    this.isLoading = true;
    this.savedWorkouts$ = this.workoutService.getSavedWorkouts();
    this.isLoading = false;
  }
}
