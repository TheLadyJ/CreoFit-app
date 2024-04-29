import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonText,
  IonAvatar,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonChip,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { WorkoutService } from 'src/app/services/workout.service';
import { UserService } from 'src/app/services/user.service';
import { BasicInfoComponent } from './segments/basic-info/basic-info.component';
import { DescriptionComponent } from './segments/description/description.component';
import { SetsComponent } from './segments/sets/sets.component';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.page.html',
  styleUrls: ['./workout-details.page.scss'],
  standalone: true,
  imports: [
    IonChip,
    IonButton,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    IonIcon,
    IonAvatar,
    IonText,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    BasicInfoComponent,
    DescriptionComponent,
    SetsComponent,
  ],
})
export class WorkoutDetailsPage implements OnInit {
  workout!: IWorkoutData;
  authorsName!: string;
  authorsProfileURL!: string;
  isSaved$!: Observable<boolean>;
  segment_value = 'basic info';
  previousPage: string = '';
  detailsFor: string = '';

  constructor(
    private route: ActivatedRoute,
    private workoutService: WorkoutService,
    private userService: UserService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workoutService.getWorkoutById(id).subscribe((workout) => {
        if (workout.id != null && workout.id != '') {
          this.workout = workout;
          this.userService
            .getUserById(this.workout.userId)
            .subscribe((user) => {
              this.authorsName = user.displayName;
              this.authorsProfileURL = user.photoURL;
            });
          this.isSaved$ = this.workoutService.isWorkoutSaved(workout.id);
        }
      });
    }
  }

  ngOnInit() {
    addIcons({ heart, heartOutline });
    this.route.url.subscribe((segments) => {
      console.log('URL Segments:', segments);
      const hasExplore = segments.some((segment) =>
        segment.path.includes('explore')
      );
      const hasMyWorkouts = segments.some((segment) =>
        segment.path.includes('my-workouts')
      );
      const hasFavorites = segments.some((segment) =>
        segment.path.includes('favorites')
      );
      const hasSearch = segments.some((segment) =>
        segment.path.includes('search')
      );
      if (hasExplore) {
        this.previousPage = '/tabs/explore';
      } else if (hasMyWorkouts) {
        this.previousPage = '/tabs/my-workouts';
        this.detailsFor = 'my-workouts';
      } else if (hasFavorites) {
        this.previousPage = '/tabs/favorites';
      } else if (hasSearch) {
        this.previousPage = '/tabs/search';
      }
    });
  }

  changeSegment(event: any) {
    this.segment_value = event.detail.value;
  }

  onHeartClicked() {
    if (this.workout.id) {
      this.workoutService.updateSavedWorkouts(this.workout.id);
    }
  }

  presentDeleteWorkoutAlert(workout: IWorkoutData) {}

  onEditWorkout(workout: IWorkoutData) {}
}
