import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonChip,
  IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { exitOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { Observable, interval } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IUser } from 'src/app/interfaces/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    IonChip,
    IonIcon,
    IonToggle,
    IonLabel,
    IonItem,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonAvatar,
  ],
})
export class AccountPage implements OnInit {
  user$!: Observable<IUser>;
  firstName: string | undefined;
  email: string | null | undefined;
  photoURL: string | null | undefined;
  basePhotoURL: string | null | undefined;
  refreshInterval$ = interval(60000);

  constructor(
    public authService: AuthService,
    private userService: UserService,
    public router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ exitOutline });
  }

  ngOnInit() {
    this.user$ = this.userService.getUserById(
      this.authService.getCurrentUser()?.uid ?? ''
    );
    this.user$.subscribe((user) => {
      this.firstName = user.displayName;
      this.email = user.email;
      this.basePhotoURL = user.photoURL;

      if (this.basePhotoURL) {
        this.refreshPhotoURL();

        // Subscribe to the interval observable
        this.refreshInterval$.subscribe(() => {
          this.refreshPhotoURL();
        });
      }
    });
  }

  private refreshPhotoURL() {
    const timestamp = new Date().getTime();
    this.photoURL = `${this.basePhotoURL}?v=${timestamp}`;
    this.cdr.markForCheck();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/imgs/profile/circle.png';
  }

  onLogout() {
    // this.alertService.presentAlert(
    //   'Failed to logout',
    //   'An unexpected error occurred. Please try again later.'
    // );
    // return;
    this.authService
      .logout()
      .then((res) => {
        // this.alertService.presentAlert(
        //   'Successful Logout',
        //   'You successfully logged out!'
        // );
        this.router.navigateByUrl('/login', { replaceUrl: true });
      })
      .catch((error) => {
        this.alertService.presentAlert('Failed To Logout', error.message);
      });
  }
}
