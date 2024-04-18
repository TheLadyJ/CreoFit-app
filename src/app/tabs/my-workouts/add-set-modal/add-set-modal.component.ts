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
  IonIcon,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { AddExerciseModalComponent } from '../add-exercise-modal/add-exercise-modal.component';
import { IExerciseData } from 'src/app/interfaces/WorkoutExercise';
import { addIcons } from 'ionicons';
import { trashBinOutline } from 'ionicons/icons';

@Component({
  selector: 'add-set-modal',
  templateUrl: './add-set-modal.component.html',
  styleUrls: ['./add-set-modal.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
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
  setData: IExerciseData[] = [];

  constructor(private modalCtrl: ModalController) {
    addIcons({ trashBinOutline });
  }

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
      this.setData.push(data);
    }
    console.log(this.setData);
  }

  onSaveSet() {
    return this.modalCtrl.dismiss(this.setData, 'confirm');
  }

  onDeleteExerciseOrBreak(exOrBr: IExerciseData) {
    this.setData = this.setData.filter((exBr) => exBr !== exOrBr);
  }
}
