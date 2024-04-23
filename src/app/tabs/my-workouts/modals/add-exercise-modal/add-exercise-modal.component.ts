import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonTitle,
  IonButtons,
  IonButton,
  IonToolbar,
  IonHeader,
  IonContent,
  IonText,
  IonList,
  IonLabel,
  IonItem,
  IonInput,
  IonRow,
  IonCol,
  IonSearchbar,
  IonIcon,
  IonCheckbox,
  IonAlert,
  IonAvatar,
  IonSkeletonText,
  IonBadge,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { catchError, finalize } from 'rxjs';
import {
  Category,
  Equipment,
  IExercise,
  Level,
  Muscle,
} from 'src/app/interfaces/ExercisesDB';
import { ExerciesService } from 'src/app/services/exercies.service';
import { ModalController } from '@ionic/angular/standalone';
import { IExerciseData } from 'src/app/interfaces/WorkoutData';
import { SearchExerciseFiltersComponent } from '../search-exercise-filters/search-exercise-filters.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'add-exercise-modal',
  templateUrl: './add-exercise-modal.component.html',
  styleUrls: ['./add-exercise-modal.component.scss'],
  standalone: true,
  imports: [
    IonBadge,
    IonSkeletonText,
    IonAvatar,
    IonAlert,
    IonCheckbox,
    IonIcon,
    IonSearchbar,
    IonCol,
    IonRow,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonText,
    IonTitle,
    IonButtons,
    IonButton,
    IonToolbar,
    IonHeader,
    IonContent,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class AddExerciseModalComponent implements OnInit {
  public dummyArray = new Array(5);
  exercises: IExercise[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  error = null;
  form!: FormGroup;
  formRepsDuration!: FormGroup;
  exerciseCheckboxes: any;
  selectedExercise: IExercise | null = null;
  repsCheck = true;
  loadMoreExercisesButtonVisibile = false;
  gifBaseUrl = '/assets/exercises-gifs/';
  // musclePossibleValues = Object.values(Muscle);
  // equipmentPossibleValues = Object.values(Equipment);
  // categoryPossibleValues = Object.values(Category);
  // levelPossibleValues = Object.values(Level);
  exerciseFilters: any = {
    exerciseName: '',
    muscle: '',
    equipment: '',
    category: '',
    level: '',
    secondaryMusclesIncluded: false,
  };

  constructor(
    public exercisesService: ExerciesService,
    private elementRef: ElementRef,
    private modalCtrl: ModalController
  ) {
    addIcons({ searchOutline });
    this.initForm();
    this.loadExercises();
  }

  initForm() {
    // this.form = new FormGroup({
    //   name: new FormControl(),
    //   muscle: new FormControl(),
    //   category: new FormControl(),
    //   level: new FormControl(),
    //   equipment: new FormControl(),
    // });
    this.formRepsDuration = new FormGroup({
      reps: new FormControl({ value: '', disabled: !this.repsCheck }),
      durationMin: new FormControl({ value: '', disabled: this.repsCheck }),
      durationSec: new FormControl({ value: '', disabled: this.repsCheck }),
    });
  }

  ngOnInit() {}

  ngAfterViewChecked() {
    this.updateCheckboxes();
  }

  private updateCheckboxes() {
    this.exerciseCheckboxes = Array.from(
      this.elementRef.nativeElement.querySelectorAll('.exerciseCheck')
    );
  }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  onPresentSearchExerciceFiltersModal = async () => {
    const modal = await this.modalCtrl.create({
      component: SearchExerciseFiltersComponent,
      cssClass: 'searchExerciseFiltersModal',
      componentProps: {
        exerciseFilters: this.exerciseFilters,
      },
      breakpoints: [0, 0.6],
      initialBreakpoint: 0.6,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.exerciseFilters = data;
      this.onSearch();
    }
  };

  onSearch() {
    // if (event) {
    //   this.exerciseFilters.name;
    // }
    this.currentPage = 1;
    this.exercises = [];
    this.loadExercises();
  }

  loadExercises() {
    this.isLoading = true;
    this.exercisesService
      .filterExercises(
        this.exerciseFilters.exerciseName,
        this.exerciseFilters.muscle,
        this.exerciseFilters.secondaryMusclesIncluded,
        this.exerciseFilters.equipment,
        this.exerciseFilters.category,
        this.exerciseFilters.level,
        // this.form.controls['name'].value,
        // this.form.controls['muscle'].value,
        // this.form.controls['equipment'].value,
        // this.form.controls['category'].value,
        // this.form.controls['level'].value,
        this.currentPage,
        this.itemsPerPage
      )
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((err: any) => {
          console.log(err);
          this.error = err.error.status_message;
          return [];
        })
      )
      .subscribe({
        next: (newExercises) => {
          this.exercises.push(...newExercises);
          this.isLoading = false;
          if (newExercises.length < 10) {
            this.loadMoreExercisesButtonVisibile = false;
          } else {
            this.loadMoreExercisesButtonVisibile = true;
          }
        },
      });
  }

  loadMore() {
    this.currentPage++;
    this.loadExercises();
  }

  onExerciseCheckboxClicked(exercise: IExercise) {
    this.selectedExercise = exercise;
    let clickedCheckbox = this.exerciseCheckboxes.find(
      (checkbox: any) => checkbox.id == exercise.id
    );
    this.selectedExercise = clickedCheckbox.checked ? exercise : null;
  }

  private checkAllNeededInput() {
    let error_message = '';
    if (this.selectedExercise == null) {
      error_message +=
        '• You have to select an exercise to add to your set. \n';
    }
    if (this.repsCheck && !this.formRepsDuration.controls['reps'].value) {
      error_message +=
        '• You have to enter the amount of reps for selected exercise. \n';
    }
    if (
      !this.repsCheck &&
      !this.formRepsDuration.controls['durationMin'].value &&
      !this.formRepsDuration.controls['durationSec'].value
    ) {
      error_message +=
        '• You have to enter the duration for selected exercise. \n';
    }
    return error_message;
  }

  private createSelectedExerciseData() {
    if (this.selectedExercise) {
      const data: IExerciseData = {
        break: false,
        exercise: this.selectedExercise,
        reps: this.repsCheck
          ? this.formRepsDuration.controls['reps'].value
          : undefined,
        duration: !this.repsCheck ? this.getDurationTime() : undefined,
      };
      return data;
    }
    return null;
  }

  private getDurationTime() {
    let dt = new Date(0, 0, 0, 0, 0, 0, 0);
    dt.setMinutes(this.formRepsDuration.controls['durationMin'].value);
    dt.setSeconds(this.formRepsDuration.controls['durationSec'].value);
    return dt;
  }

  onAddExercise() {
    const error_message = this.checkAllNeededInput();
    if (error_message) {
      alert(error_message);
      return;
    }
    const data = this.createSelectedExerciseData();
    return this.modalCtrl.dismiss(data, 'confirm');
  }
}
