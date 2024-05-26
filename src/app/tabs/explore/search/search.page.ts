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
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { Observable, catchError, filter, finalize } from 'rxjs';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { ExploreWorkoutComponent } from '../components/explore-workout/explore-workout.component';
import { WorkoutService } from 'src/app/services/workout.service';
import { ModalController } from '@ionic/angular/standalone';
import { SearchWorkoutFiltersComponent } from '../modals/search-workout-filters/search-workout-filters.component';
import { addIcons } from 'ionicons';
import { options } from 'ionicons/icons';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
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
  dummyArray = new Array(3);

  constructor(
    private workoutService: WorkoutService,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    addIcons({ options });
  }

  ngOnInit() {
    this.currentPage = 1;
    this.loadFilteredWorkouts();
    setTimeout(() => {
      this.isLoading = false;
    }, 200);

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/tabs/search') {
          this.currentPage = 1;
          this.loadFilteredWorkouts();
          setTimeout(() => {
            this.isLoading = false;
          }, 200);
        }
      });
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
          console.log('Error while filtering the workouts: ' + err);
          return [];
        })
      )
      .subscribe({
        next: (newWorkouts) => {
          if (this.currentPage == 1) {
            this.filteredWorkouts = newWorkouts.workouts; // Set newWorkouts directly if it's the first page
          } else {
            this.filteredWorkouts.push(...newWorkouts.workouts); // Otherwise append to existing workouts
          }
          this.loadMoreWorkoutsButtonVisibile = newWorkouts.hasMore;
        },
      });
  }

  loadMore() {
    this.currentPage++;
    this.loadFilteredWorkouts();
    this.isLoading = false;
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
