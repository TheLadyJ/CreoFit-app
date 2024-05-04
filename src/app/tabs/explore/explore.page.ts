import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonText,
  IonLabel,
  IonItem,
  IonList,
  IonListHeader,
  IonButton,
  IonCol,
  IonRow,
  IonSearchbar,
  IonThumbnail,
  ModalController,
} from '@ionic/angular/standalone';
import { IonicSlides } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { options, shareSocialOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { ExploreWorkoutComponent } from './components/explore-workout/explore-workout.component';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { Observable } from 'rxjs';
import { WorkoutService } from 'src/app/services/workout.service';
import { WorkoutComponent } from '../my-workouts/components/workout/workout.component';
import { Router, RouterModule } from '@angular/router';
import { SearchWorkoutFiltersComponent } from './modals/search-workout-filters/search-workout-filters.component';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonRow,
    IonCol,
    IonButton,
    IonListHeader,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonIcon,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonThumbnail,
    ExploreWorkoutComponent,
    WorkoutComponent,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExplorePage implements OnInit {
  swiperModules = [IonicSlides];
  popular: any[] = [];
  recent: any[] = [];
  firstName: string | undefined;
  email: string | null | undefined;
  photoURL: string | null | undefined;
  popularWorkouts$!: Observable<IWorkoutData[]>;
  recentWorkouts$!: Observable<IWorkoutData[]>;
  popularLimit = 3;
  recentLimit = 3;
  workoutFilters: any = {
    workoutTitle: '',
    bodyPart: null,
    minDuration: null,
    maxDuration: null,
    equipmentUsed: [],
    orderBy: '',
  };
  isLoadingRecent = true;
  isLoadingPopular = true;
  dummyArray = new Array(3);
  constructor(
    public authService: AuthService,
    private workoutService: WorkoutService,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    addIcons({ options, shareSocialOutline });
    this.firstName = this.authService.getCurrentUserFirstName();
    this.email = this.authService.getCurremtUserEmail();
    this.photoURL = this.authService.getCurremtUserPhotoURL();
  }

  ngOnInit() {
    this.loadPopularWorkouts();
    this.isLoadingPopular = false;
    this.loadRecentWorkouts();
    this.isLoadingRecent = false;
  }

  loadRecentWorkouts() {
    this.recentWorkouts$ = this.workoutService.getRecentWorkouts(
      this.recentLimit
    );
  }

  loadPopularWorkouts() {
    this.popularWorkouts$ = this.workoutService.getPopularWorkouts(
      this.popularLimit
    );
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
    }
  };

  goToSearchPage() {
    this.router.navigate(['tabs/search']);
  }
}
