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
} from '@ionic/angular/standalone';
import { IonicSlides } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { options, shareSocialOutline } from 'ionicons/icons';

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExplorePage implements OnInit {
  swiperModules = [IonicSlides];
  popular: any[] = [];
  recent: any[] = [];

  constructor() {
    addIcons({ options, shareSocialOutline });
  }

  ngOnInit() {
    this.popular = [
      {
        id: 1,
        description: 'Workout 1',
        location: 'New Delhi',
        expires_on: '30/11/23',
        post: 'Senior UX Designer',
        type: 'Full Time',
        salary: '$40-90k/year',
        logo_dark: 'ct_dark.png',
        logo_light: 'ct_light.png',
      },
      {
        id: 2,
        company: 'Uber Technologies',
        location: 'Bangalore',
        expires_on: '07/12/23',
        post: 'Full-Stack Developer',
        type: 'Full Time',
        salary: '$30-80k/year',
        logo_dark: 'uber_dark.png',
        logo_light: 'uber_light.png',
      },
      {
        id: 3,
        company: 'LinkedIn Corp.',
        location: 'Mumbai',
        expires_on: '15/12/23',
        post: 'Lead UX Designer',
        type: 'Full Time',
        salary: '$30-70k/year',
        logo_dark: 'linkedin_dark.png',
        logo_light: 'linkedin_light.png',
      },
    ];
    this.recent = [
      {
        id: 4,
        company: 'TikTok',
        location: 'New Delhi',
        expires_on: '30/11/23',
        post: 'Senior UX Designer',
        type: 'Full Time',
        salary: '$40-90k/year',
        logo_dark: 'tiktok_dark.png',
        logo_light: 'tiktok_light.png',
      },
      {
        id: 2,
        company: 'Uber Technologies',
        location: 'Bangalore',
        expires_on: '07/12/23',
        post: 'Full-Stack Developer',
        type: 'Full Time',
        salary: '$30-80k/year',
        logo_dark: 'uber_dark.png',
        logo_light: 'uber_light.png',
      },
      {
        id: 3,
        company: 'LinkedIn Corp.',
        location: 'Mumbai',
        expires_on: '15/12/23',
        post: 'Lead UX Designer',
        type: 'Full Time',
        salary: '$30-70k/year',
        logo_dark: 'linkedin_dark.png',
        logo_light: 'linkedin_light.png',
      },
    ];
  }
}