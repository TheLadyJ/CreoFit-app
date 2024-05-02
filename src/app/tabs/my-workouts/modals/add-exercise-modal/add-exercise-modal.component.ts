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
import { options, searchOutline } from 'ionicons/icons';
import { catchError, finalize } from 'rxjs';
import { IExercise } from 'src/app/interfaces/ExercisesDB';
import { ExerciesService } from 'src/app/services/exercies.service';
import { ModalController } from '@ionic/angular/standalone';
import { IExerciseData } from 'src/app/interfaces/WorkoutData';
import { SearchExerciseFiltersComponent } from '../search-exercise-filters/search-exercise-filters.component';
import { FormsModule } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';

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
  isLoading = true;
  error = null;
  formRepsDuration!: FormGroup;
  exerciseCheckboxes: any;
  selectedExercise: IExercise | null = null;
  repsCheck = true;
  loadMoreExercisesButtonVisibile = false;
  gifBaseUrl = '/assets/exercises-gifs/';
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
    private modalCtrl: ModalController,
    private alertService: AlertService
  ) {
    addIcons({ searchOutline, options });
    this.initForm();
    this.loadExercises();
  }

  initForm() {
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
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 0.7,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.exerciseFilters = data;
      this.onSearch();
    }
  };

  onSearch() {
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
        this.currentPage,
        this.itemsPerPage
      )
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((err: any) => {
          console.log('Error while getting workouts: ' + err);
          return [];
        })
      )
      .subscribe({
        next: (newExercises) => {
          this.exercises.push(...newExercises);
          this.isLoading = false;
          if (newExercises.length < this.itemsPerPage) {
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
          : null,
        duration: !this.repsCheck ? this.getDurationTime() : null,
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
      this.alertService.presentAlert(
        'Adding an exercise not possible',
        error_message
      );
      return;
    }
    const data = this.createSelectedExerciseData();
    return this.modalCtrl.dismiss(data, 'confirm');
  }
}
