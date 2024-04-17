import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() enter: EventEmitter<any> = new EventEmitter();
  @Output() exit: EventEmitter<any> = new EventEmitter();
  exerciseData: any = 'Initial exercise data';

  constructor(private modalCtrl: ModalController) {}

  close() {
    //this.exit.emit(true);
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async onEnterAddExerciseModal() {
    //this.enter.emit(true);
    const modal = await this.modalCtrl.create({
      component: AddExerciseModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.exerciseData = `Hello, ${data}!`;
    }
    console.log(this.exerciseData);
  }

  onSaveSet() {
    return this.modalCtrl.dismiss('SET DATA', 'confirm');
  }
}
