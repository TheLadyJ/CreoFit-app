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
  IonDatetime,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-workout-filters',
  templateUrl: './search-workout-filters.component.html',
  styleUrls: ['./search-workout-filters.component.scss'],
  standalone: true,
  imports: [
    IonDatetime,
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
  myWorkouts!: boolean;
  form!: FormGroup;
  equipmentPossibleValues = Object.values(Equipment);
  bodyPartPossibleValues = Object.values(BodyPart);

  constructor(private modalCtrl: ModalController) {}

  initForm() {
    this.form = new FormGroup({
      bodyPart: new FormControl(this.workoutFilters.bodyPart),
      equipmentUsed: new FormControl(this.workoutFilters.equipmentUsed),
      minDurationHrs: new FormControl(
        this.workoutFilters.minDuration?.getHours() ?? null
      ),
      minDurationMin: new FormControl(
        this.workoutFilters.minDuration?.getMinutes() ?? null
      ),
      maxDurationHrs: new FormControl(
        this.workoutFilters.maxDuration?.getHours() ?? null
      ),
      maxDurationMin: new FormControl(
        this.workoutFilters.maxDuration?.getMinutes() ?? null
      ),
      orderBy: new FormControl(this.workoutFilters.orderBy),
      isPublic: new FormControl(this.workoutFilters.isPublic),
    });
  }

  ngOnInit() {
    this.initForm();
  }

  onRemoveFilters() {
    this.form.controls['bodyPart'].setValue('');
    this.form.controls['equipmentUsed'].setValue([]);
    this.form.controls['minDurationHrs'].setValue(null);
    this.form.controls['minDurationMin'].setValue(null);
    this.form.controls['maxDurationHrs'].setValue(null);
    this.form.controls['maxDurationMin'].setValue(null);
    this.form.controls['orderBy'].setValue('');
    this.form.controls['isPublic'].setValue(null);
  }

  getDurationAsDate(hrs: number, min: number) {
    let duration = new Date(0, 0, 0, 0, 0, 0, 0);
    duration.setHours(hrs);
    duration.setMinutes(min);
    return duration;
  }

  updateWorkoutFilters() {
    this.workoutFilters.bodyPart = this.form.controls['bodyPart'].value;
    console.log(this.form.controls['equipmentUsed']);
    this.workoutFilters.equipmentUsed =
      this.form.controls['equipmentUsed'].value;
    if (
      this.form.controls['minDurationHrs'].value ||
      this.form.controls['minDurationMin'].value
    ) {
      this.workoutFilters.minDuration = this.getDurationAsDate(
        this.form.controls['minDurationHrs'].value,
        this.form.controls['minDurationMin'].value
      );
    } else {
      this.workoutFilters.minDuration = null;
    }
    if (
      this.form.controls['maxDurationHrs'].value ||
      this.form.controls['maxDurationMin'].value
    ) {
      this.workoutFilters.maxDuration = this.getDurationAsDate(
        this.form.controls['maxDurationHrs'].value,
        this.form.controls['maxDurationMin'].value
      );
    } else {
      this.workoutFilters.maxDuration = null;
    }
    this.workoutFilters.orderBy = this.form.controls['orderBy'].value;
    this.workoutFilters.isPublic = this.form.controls['isPublic'].value;
  }

  onApplyFilters() {
    this.updateWorkoutFilters();
    return this.modalCtrl.dismiss(this.workoutFilters, 'confirm');
  }
}
