import { Component, OnInit } from '@angular/core';
import {
  IonItem,
  IonInput,
  IonButton,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonContent,
  IonRow,
  IonList,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IExerciseData } from 'src/app/interfaces/WorkoutData';

@Component({
  selector: 'app-add-break-modal',
  templateUrl: './add-break-modal.component.html',
  styleUrls: ['./add-break-modal.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonLabel,
    IonList,
    IonRow,
    IonContent,
    IonButtons,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonButton,
    IonInput,
    IonItem,
    FormsModule,
  ],
})
export class AddBreakModalComponent implements OnInit {
  min!: number;
  sec!: number;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  checkAllNeededInput() {
    let error_message = '';
    if (!this.min && !this.sec) {
      error_message += '• You have to enter the duration of the break. \n';
    }
    return error_message;
  }

  createBreakData(): IExerciseData {
    return {
      break: true,
      duration: {
        min: this.min,
        sec: this.sec,
      },
    };
  }

  onAddBreak() {
    const error_message = this.checkAllNeededInput();
    if (error_message) {
      alert(error_message);
      return;
    }
    const data = this.createBreakData();
    return this.modalCtrl.dismiss(data, 'confirm');
  }
}
