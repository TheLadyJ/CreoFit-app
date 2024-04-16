import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
} from '@ionic/angular/standalone';
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
  ],
})
export class AddExerciseModalComponent implements OnInit {
  @Output() exit: EventEmitter<any> = new EventEmitter();
  @Input() exercisesService!: ExerciesService;
  public dummyArray = new Array(5);
  exercises: IExercise[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  error = null;

  constructor() {}

  ngOnInit() {}

  close() {
    this.exit.emit(true);
  }

  loadExercises() {
    this.isLoading = true;
    const name = '';
    const bodyPart = '';
    const equipment = '';
    const target = '';
    this.exercisesService
      .filterExercises(
        name,
        bodyPart,
        equipment,
        target,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe(
        (newExercises) => {
          this.exercises = [...this.exercises, ...newExercises];
          this.currentPage++;
          this.isLoading = false;
        },
        (error) => {
          // Handle error
          console.error('Error loading exercises:', error);
          this.error = error.error.status_message;
          this.isLoading = false;
        }
      );
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    // this.currentPage++;
    // this.updateMoviesObservale();
    // this.loadMovies(this.moviesObservable, event);
  }
}
