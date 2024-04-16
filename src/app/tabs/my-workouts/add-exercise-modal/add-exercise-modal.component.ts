import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  InfiniteScrollCustomEvent,
  IonInfiniteScrollContent,
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

@Component({
  selector: 'add-exercise-modal',
  templateUrl: './add-exercise-modal.component.html',
  styleUrls: ['./add-exercise-modal.component.scss'],
  standalone: true,
  imports: [
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
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
  //@Input() exercisesService!: ExerciesService;
  public dummyArray = new Array(5);
  exercises: IExercise[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  error = null;
  form!: FormGroup;

  constructor(public exercisesService: ExerciesService) {
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

  close() {
    this.exit.emit(true);
  }

  onSearch() {
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
          console.log(this.exercises);
          this.isLoading = false;
        },
      });
  }

  loadMore() {
    this.currentPage++;
    this.loadExercises();
  }
}
