import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  IonCol,
  IonRow,
  IonLabel,
  IonText,
  IonChip,
  IonIcon,
  IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { Observable, first, interval, map, merge, switchMap } from 'rxjs';
import { IUser } from 'src/app/interfaces/User';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { UserService } from 'src/app/services/user.service';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-explore-workout',
  templateUrl: './explore-workout.component.html',
  styleUrls: ['./explore-workout.component.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    IonIcon,
    IonChip,
    IonText,
    IonLabel,
    IonRow,
    IonCol,
    CommonModule,
  ],
})
export class ExploreWorkoutComponent implements OnInit {
  @Input() workout!: IWorkoutData;
  author$!: Observable<IUser>;
  isSaved$!: Observable<boolean>;
  savedCount$!: Observable<number>;
  refreshInterval$ = interval(60000);
  authorsName!: string;
  basePhotoURL!: string;
  authorsProfileURL!: string;

  constructor(
    private userService: UserService,
    private workoutService: WorkoutService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    this.author$ = this.userService.getUserById(this.workout.userId);
    this.author$.subscribe((user) => {
      this.authorsName = user.displayName;
      this.basePhotoURL = user.photoURL;

      if (this.basePhotoURL) {
        this.refreshPhotoURL();

        // Subscribe to the interval observable
        this.refreshInterval$.subscribe(() => {
          this.refreshPhotoURL();
        });
      }
    });

    if (this.workout.id) {
      this.isSaved$ = this.workoutService.isWorkoutSaved(this.workout.id);
      this.savedCount$ = this.workoutService.getSavedCount(this.workout.id);
    }
  }

  private refreshPhotoURL() {
    this.authorsProfileURL = this.basePhotoURL;
    this.cdr.markForCheck();
  }

  getDurationString(duration: any) {
    let durString = '';
    if (duration.getHours()) {
      durString += duration.getHours() + ' h';
    }
    if (duration.getMinutes()) {
      if (durString.length > 0) {
        durString += ' ';
      }
      durString += duration.getMinutes() + ' min';
    }
    return durString;
  }
}
