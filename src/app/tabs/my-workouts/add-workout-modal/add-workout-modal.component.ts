import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  IonList,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonToolbar,
  IonAvatar,
  IonImg,
  IonItem,
  IonLabel,
  IonHeader,
  IonText,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'add-workout-modal',
  templateUrl: './add-workout-modal.component.html',
  styleUrls: ['./add-workout-modal.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonText,
    IonList,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonToolbar,
    IonAvatar,
    IonImg,
    IonItem,
    IonLabel,
    IonHeader,
    IonSelect,
    IonSelectOption,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddWorkoutModalComponent implements OnInit {
  @Output() enter: EventEmitter<any> = new EventEmitter();
  @Output() exit: EventEmitter<any> = new EventEmitter();
  swiperModules = [IonicSlides];
  workoutSets: any[] = [];

  constructor() {}

  ngOnInit() {}

  close() {
    this.exit.emit(true);
  }

  onEnterAddSetModal() {
    this.enter.emit(true);
  }
}
