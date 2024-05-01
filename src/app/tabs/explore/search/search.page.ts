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
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { Observable, catchError, finalize } from 'rxjs';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { ExploreWorkoutComponent } from '../components/explore-workout/explore-workout.component';
import { WorkoutService } from 'src/app/services/workout.service';
import { ModalController } from '@ionic/angular/standalone';
import { SearchWorkoutFiltersComponent } from '../modals/search-workout-filters/search-workout-filters.component';
import { addIcons } from 'ionicons';
import { options } from 'ionicons/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonLabel,
    IonItem,
    IonList,
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
    ExploreWorkoutComponent,
    RouterModule,
  ],
})
export class SearchPage implements OnInit {
  filteredWorkouts!: IWorkoutData[];
  currentPage = 1;
  itemsPerPage = 3;
  isLoading = true;
  error = null;
  workoutFilters: any = {
    workoutTitle: '',
    bodyPart: null,
    minDuration: null,
    maxDuration: null,
    equipmentUsed: [],
    orderBy: '',
  };
  loadMoreWorkoutsButtonVisibile = false;

  constructor(
    private workoutService: WorkoutService,
    private modalCtrl: ModalController
  ) {
    addIcons({ options });
  }

  ngOnInit() {
    this.currentPage = 1;
    this.loadFilteredWorkouts();
  }

  onSearch() {
    this.currentPage = 1;
    this.filteredWorkouts = [];
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
        false, //workoutIsMine = false
        true, //isPublic = true
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
          if (this.currentPage == 1) {
            this.filteredWorkouts = newWorkouts; // Set newWorkouts directly if it's the first page
          } else {
            this.filteredWorkouts.push(...newWorkouts); // Otherwise append to existing workouts
          }
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

  onPresentSearchExerciceFiltersModal = async () => {
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
