import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Equipment } from 'src/app/interfaces/ExercisesDB';
import { BodyPart } from 'src/app/interfaces/WorkoutData';
import {
  IonItem,
  IonContent,
  IonHeader,
  IonLabel,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-workout-filters',
  templateUrl: './search-workout-filters.component.html',
  styleUrls: ['./search-workout-filters.component.scss'],
  standalone: true,
  imports: [
    IonList,
    IonButton,
    IonCheckbox,
    IonLabel,
    IonHeader,
    IonContent,
    IonItem,
    ReactiveFormsModule,
    IonSelect,
    IonSelectOption,
    FormsModule,
  ],
})
export class SearchWorkoutFiltersComponent implements OnInit {
  workoutFilters: any;
  form!: FormGroup;
  equipmentPossibleValues = Object.values(Equipment);
  bodyPartPossibleValues = Object.values(BodyPart);
  minDurationHrs!: number;
  minDurationMin!: number;
  maxDurationHrs!: number;
  maxDurationMin!: number;

  constructor(private modalCtrl: ModalController) {}

  initForm() {
    this.form = new FormGroup({
      bodyPart: new FormControl(this.workoutFilters.bodyPart),
      equipmnetUsed: new FormControl(this.workoutFilters.equipmnetUsed),
    });
    this.setMinMaxDuration();
  }

  ngOnInit() {
    this.initForm();
  }

  setMinMaxDuration() {
    this.minDurationHrs = this.workoutFilters.minDuration.getSeconds();
    this.minDurationMin = this.workoutFilters.minDuration.getMinutes();
    this.maxDurationHrs = this.workoutFilters.maxDuration.getSeconds();
    this.maxDurationMin = this.workoutFilters.maxDuration.getMinutes();
  }

  onRemoveFilters() {
    this.form.controls['bodyPart'].setValue('');
    this.form.controls['equipmnetUsed'].setValue([]);
    this.minDurationHrs = 0;
    this.minDurationMin = 0;
    this.maxDurationHrs = 0;
    this.maxDurationMin = 0;
  }

  getDurationAsDate(min: number, sec: number) {
    let duration = new Date(0, 0, 0, 0, 0, 0, 0);
    duration.setMinutes;
  }

  updateWorkoutFilters() {
    this.workoutFilters.bodyPart = this.form.controls['bodyPart'].value;
    this.workoutFilters.equipmnetUsed =
      this.form.controls['equipmnetUsed'].value;
    this.workoutFilters.minDuration = this.getDurationAsDate(
      this.minDurationHrs,
      this.minDurationMin
    );
    this.workoutFilters.maxDuration = this.getDurationAsDate(
      this.maxDurationHrs,
      this.maxDurationMin
    );
  }

  onApplyFilters() {
    this.updateWorkoutFilters();
    return this.modalCtrl.dismiss(this.workoutFilters, 'confirm');
  }
}
