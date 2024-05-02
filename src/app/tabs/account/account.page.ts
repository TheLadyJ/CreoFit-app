import { Component, OnInit } from '@angular/core';
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

  constructor(
    public authService: AuthService,
    public router: Router,
    private alertService: AlertService
  ) {
    addIcons({ exitOutline });
    this.firstName = this.authService.getCurrentUserFirstName();
    this.email = this.authService.getCurremtUserEmail();
    this.photoURL = this.authService.getCurremtUserPhotoURL();
  }

  ngOnInit() {}

  onLogout() {
    this.authService
      .logout()
      .then((res) => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      })
      .catch((error) => {
        this.alertService.presentAlert('Logout Failed', error.message);
      });
  }
}
