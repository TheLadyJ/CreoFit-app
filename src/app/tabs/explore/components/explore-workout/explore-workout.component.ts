import { Component, Input, OnInit } from '@angular/core';
import {
  IonCol,
  IonRow,
  IonLabel,
  IonText,
  IonChip,
  IonIcon,
  IonAvatar,
} from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/User';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-explore-workout',
  templateUrl: './explore-workout.component.html',
  styleUrls: ['./explore-workout.component.scss'],
  standalone: true,
  imports: [IonAvatar, IonIcon, IonChip, IonText, IonLabel, IonRow, IonCol],
})
export class ExploreWorkoutComponent implements OnInit {
  @Input() workout!: IWorkoutData;
  author$!: Observable<IUser>;
  authorsName!: string;
  authorsProfileURL!: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.author$ = this.userService.getUserById(this.workout.userId);

    this.author$.subscribe((user) => {
      this.authorsName = user.displayName;
      this.authorsProfileURL = user.photoURL;
    });
  }

  getDurationString(duration: any) {
    let durString = '';
    if (duration.getHours()) {
      durString += duration.getHours() + ' h';
    }
    if (duration.getMinutes()) {
      if (!durString) {
        durString += '';
      }
      durString += duration.getMinutes() + ' min';
    }
    return durString;
  }
}
