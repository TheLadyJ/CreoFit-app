import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
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
import { Observable, interval } from 'rxjs';
import { WorkoutService } from 'src/app/services/workout.service';
import { WorkoutComponent } from '../my-workouts/components/workout/workout.component';
import { Router, RouterModule } from '@angular/router';
import { SearchWorkoutFiltersComponent } from './modals/search-workout-filters/search-workout-filters.component';
import { IUser } from 'src/app/interfaces/User';
import { UserService } from 'src/app/services/user.service';

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
  user$!: Observable<IUser>;
  firstName: string | undefined;
  photoURL: string | null | undefined;
  basePhotoURL: string | null | undefined;
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
  refreshInterval$ = interval(60000);

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private workoutService: WorkoutService,
    private modalCtrl: ModalController,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ options, shareSocialOutline });
  }

  ngOnInit() {
    this.loadPopularWorkouts();
    this.loadRecentWorkouts();
    setTimeout(() => {
      this.isLoadingPopular = false;
      this.isLoadingRecent = false;
    }, 200);

    this.user$ = this.userService.getUserById(
      this.authService.getCurrentUser()?.uid ?? ''
    );
    this.user$.subscribe((user) => {
      this.firstName = user.displayName;
      this.basePhotoURL = user.photoURL;

      if (this.basePhotoURL) {
        this.refreshPhotoURL();

        // Subscribe to the interval observable
        this.refreshInterval$.subscribe(() => {
          this.refreshPhotoURL();
        });
      }
    });

    this.firstName = this.authService.getCurrentUserFirstName();
    this.authService.getCurremtUserPhotoURL().subscribe((url) => {
      this.basePhotoURL = url;
    });

    if (this.basePhotoURL) {
      this.refreshPhotoURL();

      // Subscribe to the interval observable
      this.refreshInterval$.subscribe(() => {
        this.refreshPhotoURL();
      });
    }
  }

  private refreshPhotoURL() {
    const timestamp = new Date().getTime();
    this.photoURL = `${this.basePhotoURL}?v=${timestamp}`;
    this.cdr.markForCheck();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/imgs/profile/circle.png';
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
