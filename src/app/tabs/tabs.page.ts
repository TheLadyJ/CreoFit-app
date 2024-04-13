import { Component, OnInit } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  barbellOutline,
  heartOutline,
  personOutline,
  searchOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonThumbnail,
  ],
})
export class TabsPage implements OnInit {
  constructor() {
    addIcons({ barbellOutline, searchOutline, heartOutline, personOutline });
  }

  ngOnInit() {}
}
