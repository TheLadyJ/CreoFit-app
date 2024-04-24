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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { exitOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [
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
  ],
})
export class AccountPage implements OnInit {
  constructor(public authService: AuthService) {
    addIcons({ exitOutline });
  }

  ngOnInit() {}

  onLogout() {}
}
