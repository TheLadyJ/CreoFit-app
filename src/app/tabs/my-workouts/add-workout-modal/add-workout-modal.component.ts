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
import { ModalController } from '@ionic/angular/standalone';
import { AddSetModalComponent } from '../add-set-modal/add-set-modal.component';

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
  setData: any = 'Initial set data';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    //this.exit.emit(true);
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async onEnterAddSetModal() {
    //this.enter.emit(true);
    const modal = await this.modalCtrl.create({
      component: AddSetModalComponent,
      cssClass: 'addSetModal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.setData = `Hello, ${data}!`;
    }
    console.log(this.setData);
  }

  onCreateWorkout() {
    return this.modalCtrl.dismiss('WORKOUT DATA', 'confirm');
  }
}
