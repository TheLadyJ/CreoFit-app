import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonLabel,
  IonContent,
  IonHeader,
} from '@ionic/angular/standalone';
import {
  Category,
  Equipment,
  Level,
  Muscle,
} from 'src/app/interfaces/ExercisesDB';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-exercise-filters',
  templateUrl: './search-exercise-filters.component.html',
  styleUrls: ['./search-exercise-filters.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonLabel,
    IonCheckbox,
    IonIcon,
    IonButton,
    IonInput,
    IonItem,
    IonCol,
    IonRow,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class SearchExerciseFiltersComponent implements OnInit {
  exerciseFilters: any;
  form!: FormGroup;
  musclePossibleValues = Object.values(Muscle);
  equipmentPossibleValues = Object.values(Equipment);
  categoryPossibleValues = Object.values(Category);
  levelPossibleValues = Object.values(Level);

  constructor(private modalCtrl: ModalController) {}

  initForm() {
    this.form = new FormGroup({
      muscle: new FormControl(this.exerciseFilters.muscle),
      category: new FormControl(this.exerciseFilters.category),
      level: new FormControl(this.exerciseFilters.level),
      equipment: new FormControl(this.exerciseFilters.equipment),
    });
  }

  ngOnInit() {
    this.initForm();
  }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  updateExerciseFilters() {
    this.exerciseFilters.muscle = this.form.controls['muscle'].value;
    this.exerciseFilters.category = this.form.controls['category'].value;
    this.exerciseFilters.level = this.form.controls['level'].value;
    this.exerciseFilters.equipment = this.form.controls['equipment'].value;
  }

  onApplyFilters() {
    this.updateExerciseFilters();
    return this.modalCtrl.dismiss(this.exerciseFilters, 'confirm');
  }
}
