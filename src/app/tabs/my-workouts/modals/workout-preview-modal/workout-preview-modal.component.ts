import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-workout-preview-modal',
  templateUrl: './workout-preview-modal.component.html',
  styleUrls: ['./workout-preview-modal.component.scss'],
})
export class WorkoutPreviewModalComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
}
