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
} from '@ionic/angular/standalone';
import { Observable, catchError, finalize } from 'rxjs';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { ExploreWorkoutComponent } from '../components/explore-workout/explore-workout.component';
import { WorkoutService } from 'src/app/services/workout.service';
import { ModalController } from '@ionic/angular/standalone';
import { SearchWorkoutFiltersComponent } from '../modals/search-workout-filters/search-workout-filters.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
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
  ],
})
export class SearchPage implements OnInit {
  filteredWorkouts!: IWorkoutData[];
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = true;
  error = null;
  workoutFilters: any = {
    workoutTitle: '',
    bodyPart: '',
    minDuration: null,
    maxDuration: null,
    equipmentUsed: [],
  };
  loadMoreWorkoutsButtonVisibile = false;

  constructor(
    private workoutService: WorkoutService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  onSearch() {
    this.currentPage = 1;
    this.filteredWorkouts = [];
    this.loadWorkouts();
  }

  loadWorkouts() {
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
        true //workoutIsPublic = true
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
          this.filteredWorkouts.push(...newWorkouts);
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
    this.loadWorkouts();
  }

  onPresentSearchExerciceFiltersModal = async () => {
    const modal = await this.modalCtrl.create({
      component: SearchWorkoutFiltersComponent,
      cssClass: 'searchWorkoutFiltersModal',
      componentProps: {
        workoutFilters: this.workoutFilters,
      },
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 0.7,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.workoutFilters = data;
      this.onSearch();
    }
  };
}
