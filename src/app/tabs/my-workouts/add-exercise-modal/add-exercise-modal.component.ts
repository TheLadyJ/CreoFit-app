import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
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
  IonInfiniteScroll,
  IonBadge,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { catchError, finalize } from 'rxjs';
import { IExercise } from 'src/app/interfaces/IExercise';
import { ExerciesService } from 'src/app/services/exercies.service';
import { ModalController } from '@ionic/angular/standalone';
import { IExerciseData } from 'src/app/interfaces/IExerciseData';

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
  ],
})
export class AddExerciseModalComponent implements OnInit {
  @Output() exit: EventEmitter<any> = new EventEmitter();
  public dummyArray = new Array(5);
  exercises: IExercise[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  error = null;
  form!: FormGroup;
  formRepsDuration!: FormGroup;
  exerciseCheckboxes: any;
  private selectedExercise!: IExercise | null;
  repsCheck = true;
  loadMoreExercisesButtonVisibile = false;

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
    this.form = new FormGroup({
      name: new FormControl(),
      bodyPart: new FormControl(),
      target: new FormControl(),
      equipment: new FormControl(),
    });
    this.formRepsDuration = new FormGroup({
      reps: new FormControl(),
      durationMin: new FormControl(),
      durationSec: new FormControl(),
    });
  }

  ngOnInit() {}

  ngAfterViewChecked() {
    this.exerciseCheckboxes = Array.from(
      this.elementRef.nativeElement.querySelectorAll('.exerciseCheck')
    );
  }

  close() {
    //this.exit.emit(true);
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  onSearch() {
    this.currentPage = 1;
    this.exercises = [];
    this.loadExercises();
  }

  loadExercises() {
    this.isLoading = true;
    this.exercisesService
      .filterExercises(
        this.form.value.name,
        this.form.value.bodyPart,
        this.form.value.equipment,
        this.form.value.target,
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

    if (clickedCheckbox.checked) {
      this.selectedExercise = exercise;
      this.exerciseCheckboxes.forEach((checkbox: any) => {
        if (checkbox.id !== exercise.id) {
          checkbox.disabled = true;
        }
      });
    } else {
      this.selectedExercise = null;
      this.exerciseCheckboxes.forEach(
        (checkbox: any) => (checkbox.disabled = false)
      );
    }
  }

  private checkAllNeededInput() {
    let error_message = '';
    if (this.selectedExercise == null) {
      error_message +=
        '• You have to select an exercise to add to your set. \n';
    }
    if (this.repsCheck && !this.formRepsDuration.value.reps) {
      error_message +=
        '• You have to enter the amount of reps for selected exercise. \n';
    }
    if (
      !this.repsCheck &&
      !this.formRepsDuration.value.durationMin &&
      !this.formRepsDuration.value.durationSec
    ) {
      error_message +=
        '• You have to enter the duration for selected exercise. \n';
    }
    return error_message;
  }

  private createSelectedExerciseData() {
    if (this.selectedExercise) {
      const data: IExerciseData = {
        exercise: this.selectedExercise,
        reps: this.repsCheck ? this.formRepsDuration.value.reps : undefined,
        duration: !this.repsCheck
          ? {
              min: this.formRepsDuration.value.durationMin,
              sec: this.formRepsDuration.value.durationSec,
            }
          : undefined,
      };
      return data;
    }
    return null;
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
