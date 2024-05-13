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
  IonText,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { WorkoutService } from 'src/app/services/workout.service';
import { Observable, catchError, finalize } from 'rxjs';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { WorkoutComponent } from '../my-workouts/components/workout/workout.component';
import { RouterModule } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { SearchWorkoutFiltersComponent } from '../explore/modals/search-workout-filters/search-workout-filters.component';
import { addIcons } from 'ionicons';
import { options } from 'ionicons/icons';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonText,
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
  isLoading = true;
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
  filteredWorkouts: IWorkoutData[] = [];
  loadMoreWorkoutsButtonVisibile: boolean = false;
  dummyArray = new Array(3);

  constructor(
    private workoutService: WorkoutService,
    private modalCtrl: ModalController,
    private alertService: AlertService
  ) {
    addIcons({ options });
    this.filteredWorkouts = [];
    this.loadFilteredWorkouts();
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
    // this.alertService.presentAlert(
    //   'An error occurred',
    //   'There was an error while getting workouts.'
    // );
  }

  ngOnInit() {
    //this.loadFilteredWorkouts();
  }

  onSearch() {
    this.currentPage = 1;
    this.filteredWorkouts = [];
    this.loadFilteredWorkouts();
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }

  loadFilteredWorkouts() {
    if (this.currentPage == 1) {
      this.filteredWorkouts = [];
    }
    this.isLoading = true;
    this.workoutService
      .getSavedWorkouts(
        this.workoutFilters.workoutTitle,
        this.workoutFilters.bodyPart,
        this.workoutFilters.minDuration,
        this.workoutFilters.maxDuration,
        this.workoutFilters.equipmentUsed,
        this.currentPage,
        this.itemsPerPage,
        this.workoutFilters.orderBy
      )
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((err: any) => {
          console.log('Error while getting workouts:' + err);
          return [];
        })
      )
      .subscribe({
        next: (newWorkouts) => {
          if (this.currentPage == 1) {
            this.filteredWorkouts = newWorkouts; // Set newWorkouts directly if it's the first page
          } else {
            this.filteredWorkouts.push(...newWorkouts); // Otherwise append to existing workouts
          }
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
    this.isLoading = false;
  }

  onPresentSearchWorkoutFiltersModal = async () => {
    const modal = await this.modalCtrl.create({
      component: SearchWorkoutFiltersComponent,
      cssClass: 'searchWorkoutFiltersModal',
      componentProps: {
        workoutFilters: this.workoutFilters,
        myWorkouts: false,
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
