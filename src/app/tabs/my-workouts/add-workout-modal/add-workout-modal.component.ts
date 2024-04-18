import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
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
import { WorkoutSetSlideComponent } from '../workout-set-slide/workout-set-slide.component';

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
    WorkoutSetSlideComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddWorkoutModalComponent implements OnInit {
  swiperModules = [IonicSlides];
  workoutSets: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async onEnterAddSetModal() {
    const modal = await this.modalCtrl.create({
      component: AddSetModalComponent,
      cssClass: 'addSetModal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.workoutSets.push(data);
    }
    console.log(this.workoutSets);
  }

  onCreateWorkout() {
    //checkinput
    //createWorkoutData
    return this.modalCtrl.dismiss('WORKOUT DATA', 'confirm');
  }
}
