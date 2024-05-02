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
import { AlertService } from 'src/app/services/alert.service';

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

  constructor(
    private modalCtrl: ModalController,
    private alertService: AlertService
  ) {}

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

  private setDurationMinSec(min?: number, sec?: number) {
    let dt = new Date(0, 0, 0, 0, 0, 0, 0);
    dt.setMinutes(min ? min : 0);
    dt.setSeconds(sec ? sec : 0);
    return dt;
  }

  createBreakData(): IExerciseData {
    return {
      break: true,
      duration: this.setDurationMinSec(this.min, this.sec),
    };
  }

  onAddBreak() {
    const error_message = this.checkAllNeededInput();
    if (error_message) {
      this.alertService.presentAlert(
        'Adding a break not possible',
        error_message
      );
      return;
    }
    const data = this.createBreakData();
    return this.modalCtrl.dismiss(data, 'confirm');
  }
}
