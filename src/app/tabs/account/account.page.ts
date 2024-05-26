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
import { interval } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  firstName: string | undefined;
  email: string | null | undefined;
  photoURL: string | null | undefined;
  basePhotoURL: string | null | undefined;
  refreshInterval$ = interval(60000);

  constructor(
    public authService: AuthService,
    public router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ exitOutline });
  }

  ngOnInit() {
    this.firstName = this.authService.getCurrentUserFirstName();
    this.email = this.authService.getCurremtUserEmail();
    this.basePhotoURL = this.authService.getCurremtUserPhotoURL();

    if (this.basePhotoURL) {
      this.refreshPhotoURL();

      // Subscribe to the interval observable
      this.refreshInterval$.subscribe(() => {
        this.refreshPhotoURL();
      });
    }
  }

  private refreshPhotoURL() {
    this.photoURL = this.basePhotoURL;
    this.cdr.markForCheck();
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
