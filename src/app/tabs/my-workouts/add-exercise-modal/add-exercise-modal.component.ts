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

  onAddExercise() {
    return this.modalCtrl.dismiss('EXERCISE DATA', 'confirm');
  }
}
