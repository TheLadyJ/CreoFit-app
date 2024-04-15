import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  public isLoading = false;
  public error = null;
  public dummyArray = new Array(5);
  public exercises: IExercise[] = [];

  constructor() {}

  ngOnInit() {}

  close() {
    this.exit.emit(true);
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    // this.currentPage++;
    // this.updateMoviesObservale();
    // this.loadMovies(this.moviesObservable, event);
  }
}
