import {
  Component,
  ElementRef,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonToolbar,
  IonHeader,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonCheckbox,
  IonText,
  IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { IonicSlides } from '@ionic/angular';
import Swiper from 'swiper';
import { IWorkoutData } from 'src/app/interfaces/WorkoutData';

@Component({
  selector: 'app-start-workout-modal',
  templateUrl: './start-workout-modal.component.html',
  styleUrls: ['./start-workout-modal.component.scss'],
  standalone: true,
  imports: [
    IonChip,
    IonText,
    IonCheckbox,
    IonList,
    IonLabel,
    IonItem,
    IonInput,
    IonTitle,
    IonIcon,
    IonButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonContent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StartWorkoutModalComponent implements OnInit {
  previousPage!: string;
  workout!: IWorkoutData;
  swipePage?: Swiper;
  swiperModules = [IonicSlides];

  constructor(public router: Router, private elementRef: ElementRef) {
    addIcons({ close });
  }

  ngOnInit() {}

  onExitButton() {
    this.router.navigateByUrl(this.previousPage, { replaceUrl: true });
  }

  swiperReady() {
    this.swipePage =
      this.elementRef.nativeElement.querySelector('.swiperContainer').swiper;
  }
}
