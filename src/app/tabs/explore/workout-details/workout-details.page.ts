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
  AlertController,
  ModalController,
  IonItem,
  IonList,
  IonSkeletonText,
  IonAlert,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { WorkoutService } from 'src/app/services/workout.service';
import { UserService } from 'src/app/services/user.service';
import { BasicInfoComponent } from './segments/basic-info/basic-info.component';
import { DescriptionComponent } from './segments/description/description.component';
import { SetsComponent } from './segments/sets/sets.component';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  colorWandOutline,
  heart,
  heartOutline,
  trashOutline,
} from 'ionicons/icons';
import { Observable, interval, merge, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AddWorkoutModalComponent } from '../../my-workouts/modals/add-workout-modal/add-workout-modal.component';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.page.html',
  styleUrls: ['./workout-details.page.scss'],
  standalone: true,
  imports: [
    IonAlert,
    IonSkeletonText,
    IonList,
    IonItem,
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
    IonItem,
  ],
})
export class WorkoutDetailsPage implements OnInit {
  workout!: IWorkoutData;
  authorsName!: string;
  authorsProfileURL!: string;
  isSaved$!: Observable<boolean>;
  savedCount$!: Observable<number>;
  segment_value = 'basic info';
  previousPage: string = '';
  detailsFor: string = '';
  isLoading = true;
  isEdited = false;
  refreshInterval$ = interval(360000);

  constructor(
    private route: ActivatedRoute,
    private workoutService: WorkoutService,
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController,
    public router: Router,
    private modalCtrl: ModalController,
    private alertService: AlertService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workoutService.getWorkoutById(id).subscribe((workout) => {
        if (workout.id != null && workout.id != '') {
          this.workout = workout;
          merge(
            this.userService.getUserById(this.workout.userId),
            this.refreshInterval$
          )
            .pipe(
              switchMap(() => this.userService.getUserById(this.workout.userId))
            )
            .subscribe((user) => {
              this.authorsName = user.displayName;
              this.authorsProfileURL = user.photoURL;
            });
          this.isSaved$ = this.workoutService.isWorkoutSaved(workout.id);
          this.savedCount$ = this.workoutService.getSavedCount(workout.id);
        }
        this.isLoading = false;
      });
    }
  }

  ngOnInit() {
    addIcons({
      heart,
      heartOutline,
      trashOutline,
      colorWandOutline,
      arrowBackOutline,
    });
    this.route.url.subscribe((segments) => {
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

  onBackButton() {
    this.router.navigateByUrl(this.previousPage, { replaceUrl: true });
  }

  changeSegment(event: any) {
    this.segment_value = event.detail.value;
  }

  onHeartClicked() {
    let thisUserId = this.authService.getCurrentUser()?.uid;
    if (this.workout.userId == thisUserId) {
      let header = 'Error occurred';
      let message =
        'You cannot save your own workout in your favorite workouts';
      this.alertService.presentAlert(header, message);
    }
    if (this.workout.id) {
      this.workoutService.updateSavedWorkouts(this.workout.id);
    }
  }

  presentDeleteWorkoutAlert = async (workout: IWorkoutData) => {
    const alert = await this.alertController.create({
      header: 'Delete confirmation',
      message: 'Are you sure you want to delete this workout?',
      buttons: [
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: 'set-alert-delete-button',
          handler: () => this.deleteWorkout(workout),
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'set-alert-cancel-button',
        },
      ],
      mode: 'ios',
    });

    await alert.present();
  };

  deleteWorkout(workout: IWorkoutData) {
    this.workoutService.deleteWorkout(workout);
    this.alertService.presentAlert(
      'Success',
      'Workout was successfully deleted!'
    );
    this.router.navigate(['/tabs/my-workouts']);
  }

  openEditWorkoutModal = async (workout: IWorkoutData) => {
    const modal = await this.modalCtrl.create({
      component: AddWorkoutModalComponent,
      cssClass: 'addWorkoutModal',
      componentProps: {
        edit: true,
        workout: workout,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.isEdited = true;
      console.log('Workout saved');
      this.router.navigateByUrl('/tabs/my-workouts/workout/' + workout.id, {
        replaceUrl: true,
      });
      this.alertService.presentAlert(
        'Success',
        'Workout successfully updated!'
      );
    } else {
      console.log('Workout was not saved');
    }
  };
}
