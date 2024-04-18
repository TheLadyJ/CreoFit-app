import { Component } from '@angular/core';
import {
  IonList,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonToolbar,
  IonItem,
  IonLabel,
  IonHeader,
  IonText,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { AddExerciseModalComponent } from '../add-exercise-modal/add-exercise-modal.component';
import { IExerciseData } from 'src/app/interfaces/WorkoutExercise';

@Component({
  selector: 'add-set-modal',
  templateUrl: './add-set-modal.component.html',
  styleUrls: ['./add-set-modal.component.scss'],
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
    IonItem,
    IonLabel,
    IonHeader,
    IonSelect,
    IonSelectOption,
  ],
})
export class AddSetModalComponent {
  exerciseData: IExerciseData[] = [];

  constructor(private modalCtrl: ModalController) {}

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async onEnterAddExerciseModal() {
    const modal = await this.modalCtrl.create({
      component: AddExerciseModalComponent,
      cssClass: 'addExerciseModal',
    });
    modal.present();

    let { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.exerciseData.push(data);
    }
    console.log(this.exerciseData);
  }

  onSaveSet() {
    return this.modalCtrl.dismiss('SET DATA', 'confirm');
  }
}
