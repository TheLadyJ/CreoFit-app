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
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { AddExerciseModalComponent } from '../add-exercise-modal/add-exercise-modal.component';
import { IExerciseData, ISetData } from 'src/app/interfaces/WorkoutData';
import { addIcons } from 'ionicons';
import { trashBinOutline, trashOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { AddBreakModalComponent } from '../add-break-modal/add-break-modal.component';

@Component({
  selector: 'add-set-modal',
  templateUrl: './add-set-modal.component.html',
  styleUrls: ['./add-set-modal.component.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
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
    FormsModule,
  ],
})
export class AddSetModalComponent {
  exercisesData: IExerciseData[] = [];
  repeting!: number;

  constructor(private modalCtrl: ModalController) {
    addIcons({ trashOutline });
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
      this.exercisesData.push(data);
    }
    console.log(this.exercisesData);
  }

  async onEnterAddBreakModal() {
    const modal = await this.modalCtrl.create({
      component: AddBreakModalComponent,
      cssClass: 'addBreakModal',
    });
    modal.present();

    let { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.exercisesData.push(data);
    }
    console.log(this.exercisesData);
  }

  private checkAllNeededInput() {
    let error_message = '';
    if (this.exercisesData.length == 0) {
      error_message += '• You have to add some exercises to your set. \n';
    }
    if (!this.repeting) {
      error_message += '• You have to add the repetion number for this set. \n';
    }
    return error_message;
  }

  createSetData(): ISetData {
    return {
      exercisesData: this.exercisesData,
      repeting: this.repeting,
    };
  }

  onSaveSet() {
    const error_message = this.checkAllNeededInput();
    if (error_message) {
      alert(error_message);
      return;
    }
    const data = this.createSetData();
    return this.modalCtrl.dismiss(data, 'confirm');
  }

  onDeleteExerciseOrBreak(exOrBr: IExerciseData) {
    this.exercisesData = this.exercisesData.filter((exBr) => exBr !== exOrBr);
  }
}
