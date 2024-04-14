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
  @Output() exit: EventEmitter<any> = new EventEmitter();

  constructor() {}

  close() {
    this.exit.emit(true);
  }
}
