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
import { Observable, catchError, finalize } from 'rxjs';
import { WorkoutComponent } from './components/workout/workout.component';
import { RouterModule } from '@angular/router';
import { SearchWorkoutFiltersComponent } from '../explore/modals/search-workout-filters/search-workout-filters.component';

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
  currentPage = 1;
  itemsPerPage = 3;
  workoutFilters = {
    workoutTitle: '',
    bodyPart: null,
    minDuration: null,
    maxDuration: null,
    equipmentUsed: [],
    orderBy: '',
    isPublic: null,
  };
  myFilteredWorkouts: IWorkoutData[] = [];
  myFilteredWorkouts$!: Observable<IWorkoutData[]>;

  loadMoreWorkoutsButtonVisibile: boolean = false;
  error: string = '';

  constructor(
    private modalCtrl: ModalController,
    private workoutService: WorkoutService
  ) {
    addIcons({ addOutline, options });
  }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.loadFilteredWorkouts();
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
      this.onSearch();
    } else {
      console.log('Workout was not saved');
    }
  };

  onSearch() {
    this.currentPage = 1;
    this.myFilteredWorkouts = [];
    this.loadFilteredWorkouts();
  }

  loadFilteredWorkouts() {
    this.isLoading = true;
    this.workoutService
      .filterWorkouts(
        this.workoutFilters.workoutTitle,
        this.workoutFilters.bodyPart,
        this.workoutFilters.minDuration,
        this.workoutFilters.maxDuration,
        this.workoutFilters.equipmentUsed,
        this.currentPage,
        this.itemsPerPage,
        true, //workoutIsMine = true
        this.workoutFilters.isPublic,
        this.workoutFilters.orderBy
      )
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((err: any) => {
          console.log(err);
          return [];
        })
      )
      .subscribe({
        next: (newWorkouts) => {
          this.myFilteredWorkouts.push(...newWorkouts);
          this.isLoading = false;
          if (newWorkouts.length < this.itemsPerPage) {
            this.loadMoreWorkoutsButtonVisibile = false;
          } else {
            this.loadMoreWorkoutsButtonVisibile = true;
          }
        },
      });
  }

  loadMore() {
    this.currentPage++;
    this.loadFilteredWorkouts();
  }

  onPresentSearchWorkoutFiltersModal = async () => {
    const modal = await this.modalCtrl.create({
      component: SearchWorkoutFiltersComponent,
      cssClass: 'searchWorkoutFiltersModal',
      componentProps: {
        workoutFilters: this.workoutFilters,
        myWorkouts: true,
      },
      breakpoints: [0, 0.9, 1],
      initialBreakpoint: 0.9,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.workoutFilters = data;
      this.onSearch();
    }
  };
}
