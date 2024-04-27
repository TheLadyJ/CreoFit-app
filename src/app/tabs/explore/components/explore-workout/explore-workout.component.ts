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

  constructor(private userService: UserService) {}

  ngOnInit() {}

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

  getAuthorsName(userId: string) {
    return this.userService.getUserById(userId).subscribe((user: IUser) => {
      return user.displayName;
    });
  }

  getAuthorsProfilePic(userId: string) {
    return this.userService.getUserById(userId).subscribe((user: IUser) => {
      return user.photoURL;
    });
  }
}
