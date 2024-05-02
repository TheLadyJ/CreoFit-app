import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {
  IonList,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonToolbar,
  IonAvatar,
  IonImg,
  IonItem,
  IonLabel,
  IonHeader,
  IonText,
  IonInput,
  IonSelect,
  IonSelectOption,
  AlertController,
  IonTextarea,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { AddSetModalComponent } from '../add-set-modal/add-set-modal.component';
import { WorkoutSetSlideComponent } from '../../components/workout-set-slide/workout-set-slide.component';
import {
  BodyPart,
  IExerciseData,
  ISetData,
  IWorkoutData,
} from 'src/app/interfaces/WorkoutData';
import { OrdinalPipe } from 'src/app/pipes/ordinal.pipe';
import { DatePipe } from '@angular/common';
import Swiper from 'swiper';
import { addIcons } from 'ionicons';
import {
  colorWandOutline,
  sparklesOutline,
  trashOutline,
} from 'ionicons/icons';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Equipment } from 'src/app/interfaces/ExercisesDB';
import { WorkoutService } from 'src/app/services/workout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'add-workout-modal',
  templateUrl: './add-workout-modal.component.html',
  styleUrls: ['./add-workout-modal.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonText,
    IonList,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonToolbar,
    IonAvatar,
    IonImg,
    IonItem,
    IonLabel,
    IonHeader,
    IonSelect,
    IonSelectOption,
    WorkoutSetSlideComponent,
    OrdinalPipe,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    IonTextarea,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddWorkoutModalComponent implements OnInit {
  @ViewChild('textareaRef') textareaRef!: IonTextarea;
  swipePage?: Swiper;
  swipeSlides?: Swiper;
  swiperModules = [IonicSlides];
  workoutSets: ISetData[] = [
    {
      exercisesData: [
        {
          break: false,
          exercise: {
            name: '3/4 Sit-Up',
            force: 'pull',
            level: 'beginner',
            mechanic: 'compound',
            equipment: 'body only',
            primaryMuscles: ['abdominals'],
            secondaryMuscles: [],
            instructions: [
              'Lie down on the floor and secure your feet. Your legs should be bent at the knees.',
              'Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.',
              'Flex your hips and spine to raise your torso toward your knees.',
              'At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down.',
              'Repeat for the recommended amount of repetitions.',
            ],
            category: 'strength',
            images: ['3_4_Sit-Up/0.jpg', '3_4_Sit-Up/1.jpg'],
            id: '3_4_Sit-Up',
          },
          duration: this.setDurationMinSec(0, 30),
        },
        {
          break: true,
          duration: this.setDurationMinSec(0, 30),
        },
        {
          break: false,
          exercise: {
            name: '90/90 Hamstring',
            force: 'push',
            level: 'beginner',
            mechanic: null,
            equipment: 'body only',
            primaryMuscles: ['hamstrings'],
            secondaryMuscles: ['calves'],
            instructions: [
              'Lie on your back, with one leg extended straight out.',
              'With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position.',
              'Extend your leg straight into the air, pausing briefly at the top. Return the leg to the starting position.',
              'Repeat for 10-20 repetitions, and then switch to the other leg.',
            ],
            category: 'stretching',
            images: ['90_90_Hamstring/0.jpg', '90_90_Hamstring/1.jpg'],
            id: '90_90_Hamstring',
          },
          duration: this.setDurationMinSec(0, 30),
        },
      ],
      repeting: 2,
    },
    {
      exercisesData: [
        {
          break: false,
          exercise: {
            name: '3/4 Sit-Up',
            force: 'pull',
            level: 'beginner',
            mechanic: 'compound',
            equipment: 'body only',
            primaryMuscles: ['abdominals'],
            secondaryMuscles: [],
            instructions: [
              'Lie down on the floor and secure your feet. Your legs should be bent at the knees.',
              'Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.',
              'Flex your hips and spine to raise your torso toward your knees.',
              'At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down.',
              'Repeat for the recommended amount of repetitions.',
            ],
            category: 'strength',
            images: ['3_4_Sit-Up/0.jpg', '3_4_Sit-Up/1.jpg'],
            id: '3_4_Sit-Up',
          },
          duration: this.setDurationMinSec(0, 30),
        },
        {
          break: true,
          duration: this.setDurationMinSec(0, 30),
        },
        {
          break: false,
          exercise: {
            name: '90/90 Hamstring',
            force: 'push',
            level: 'beginner',
            mechanic: null,
            equipment: 'body only',
            primaryMuscles: ['hamstrings'],
            secondaryMuscles: ['calves'],
            instructions: [
              'Lie on your back, with one leg extended straight out.',
              'With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position.',
              'Extend your leg straight into the air, pausing briefly at the top. Return the leg to the starting position.',
              'Repeat for 10-20 repetitions, and then switch to the other leg.',
            ],
            category: 'stretching',
            images: ['90_90_Hamstring/0.jpg', '90_90_Hamstring/1.jpg'],
            id: '90_90_Hamstring',
          },
          duration: this.setDurationMinSec(0, 30),
        },
      ],
      repeting: 2,
    },
  ];
  breakpointsJson: any = {
    // when window width is >= 320px
    320: {
      slidesPerView: 1.6,
      spaceBetween: 20,
    },
    // when window width is >= 400px
    400: {
      slidesPerView: 1.8,
      spaceBetween: 20,
    },
    // when window width is >= 460px
    460: {
      slidesPerView: 2,
      spaceBetween: 25,
    },
    // when window width is >= 540px
    540: {
      slidesPerView: 2.5,
      spaceBetween: 25,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    // when window width is >= 700px
    700: {
      slidesPerView: 3.3,
      spaceBetween: 40,
    },
  };
  minRestBetweenSets!: number;
  secRestBetweenSets!: number;
  restBetweenSets!: Date;
  description!: string;
  title!: string;
  bodyPart!: BodyPart;
  workoutIsPublic!: boolean;
  deleteSetAlertButtons: any = [
    {
      text: 'Cancel',
      cssClass: 'alert-button-cancel',
      role: 'cancel',
    },
    {
      text: 'Delete',
      cssClass: 'alert-button-delete',
      role: 'confirm',
      handler: () => {},
    },
  ];
  edit!: boolean;
  workout!: IWorkoutData;

  bodyPartPossilbeValues = Object.values(BodyPart);

  constructor(
    private modalCtrl: ModalController,
    private elementRef: ElementRef,
    private alertController: AlertController,
    private authService: AuthService,
    private workoutSerivce: WorkoutService,
    private cdr: ChangeDetectorRef
  ) {
    this.restBetweenSets = new Date(0, 0, 0, 0, 0, 0, 0);
    addIcons({ sparklesOutline, trashOutline, colorWandOutline });
  }

  ngOnInit() {
    if (this.workout) {
      this.title = this.workout.title;
      this.description = this.workout.description;
      this.bodyPart = this.workout.bodyPart;
      this.workoutIsPublic = this.workout.isPublic;
      this.workoutSets = this.workout.setData;
      this.minRestBetweenSets = this.workout.restBetweenSets.getMinutes();
      this.secRestBetweenSets = this.workout.restBetweenSets.getSeconds();
      this.onChangedRestBetweenSets();
      this.cdr.detectChanges();
    }
  }

  swiperReady() {
    this.swipePage = this.elementRef.nativeElement.querySelector(
      '.swipePageContainer'
    ).swiper;

    this.swipeSlides = this.elementRef.nativeElement.querySelector(
      '.swipeSetsContainer'
    ).swiper;
  }

  selectBodyPartChange(event: any) {
    this.bodyPart = event.detail.value;
  }

  nextPage() {
    this.swipePage?.slideNext();
  }

  prevPage() {
    this.swipePage?.slidePrev();
  }

  ngAfterViewInit() {
    this.swiperReady();
    this.textareaRef.setFocus();
  }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  private setDurationMinSec(min?: number, sec?: number) {
    let dt = new Date(0, 0, 0, 0, 0, 0, 0);
    dt.setMinutes(min ? min : 0);
    dt.setSeconds(sec ? sec : 0);
    return dt;
  }

  onlyDurationExercises() {
    return !this.workoutSets.some((set) =>
      set.exercisesData.some(
        (exercise) => exercise.reps != null || exercise.reps != undefined
      )
    );
  }

  totalNumberOfSets() {
    let sum = 0;
    this.workoutSets.forEach((set) => (sum += set.repeting));
    return sum;
  }

  addMinutes(date: Date, minutesToAdd: number) {
    date.setMinutes(date.getMinutes() + minutesToAdd);
  }

  addSeconds(date: Date, secondsToAdd: number) {
    date.setSeconds(date.getSeconds() + secondsToAdd);
  }

  addTimeBasedOnExercise(exercise: IExerciseData, estimatedDuration: Date) {
    if (exercise.reps != null && exercise.reps != undefined) {
      let secondsToAdd: number = exercise.reps * 3;
      this.addSeconds(estimatedDuration, secondsToAdd);
    } else if (exercise.duration != null && exercise.duration != undefined) {
      this.addMinutes(estimatedDuration, exercise.duration.getMinutes());
      this.addSeconds(estimatedDuration, exercise.duration.getSeconds());
    }
  }

  addTotalRestBetweenSets(estimatedDuration: Date) {
    for (let i = 0; i < this.totalNumberOfSets() - 1; i++) {
      this.addMinutes(estimatedDuration, this.restBetweenSets.getMinutes());
      this.addSeconds(estimatedDuration, this.restBetweenSets.getSeconds());
    }
  }

  calculatedDuration() {
    let estimatedDuration = new Date(0, 0, 0, 0, 0, 0, 0);
    for (let set of this.workoutSets) {
      for (let exercise of set.exercisesData) {
        for (let i = 0; i < set.repeting; i++) {
          this.addTimeBasedOnExercise(exercise, estimatedDuration);
        }
      }
    }
    this.addTotalRestBetweenSets(estimatedDuration);
    return estimatedDuration;
  }

  updateSetSlides() {
    setTimeout(() => {
      this.swipeSlides?.update();
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  onEnterAddSetModal = async (set?: ISetData) => {
    let numOfSets = this.workoutSets.length;
    const modal = await this.modalCtrl.create({
      component: AddSetModalComponent,
      cssClass: 'addSetModal',
      componentProps: {
        setNumber: numOfSets + 1,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.workoutSets.push(data);
      this.updateSetSlides();
    }
  };

  getEquipmentUsed() {
    let equipment_used = new Set<Equipment>();
    for (let set of this.workoutSets) {
      for (let exerciseData of set.exercisesData) {
        if (exerciseData.exercise?.equipment) {
          const eq = exerciseData.exercise?.equipment as Equipment;
          equipment_used.add(eq);
        }
      }
    }
    if (equipment_used.has(Equipment.body) && equipment_used.size > 1) {
      equipment_used.delete(Equipment.body);
    }
    return Array.from(equipment_used);
  }

  getCurrentDate() {
    return new Date();
  }

  getCurrentUserId() {
    return this.authService.getCurrentUser()?.uid ?? '';
  }

  getWorkoutData = () => {
    let workoutData: IWorkoutData = {
      id: this.workout?.id ?? null,
      title: this.title,
      description: this.description,
      bodyPart: this.bodyPart,
      isPublic: this.workoutIsPublic,
      setData: this.workoutSets,
      userId: this.getCurrentUserId(),
      restBetweenSets: this.restBetweenSets,
      totalDuration: this.calculatedDuration(),
      equipment_used: this.getEquipmentUsed(),
      date_created: this.getCurrentDate(),
      savedCount: 0,
    };
    return workoutData;
  };

  onEditSet = async (set: ISetData) => {
    let setNumber = this.workoutSets.findIndex((s) => s == set);
    const modal = await this.modalCtrl.create({
      component: AddSetModalComponent,
      cssClass: 'addSetModal',
      componentProps: {
        setNumber: setNumber + 1,
        exercisesData: set.exercisesData,
        repeting: set.repeting,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.workoutSets[setNumber] = data;
      this.updateSetSlides();
    }
  };

  deleteSet(set: ISetData) {
    this.workoutSets = this.workoutSets.filter((s) => s !== set);
    this.updateSetSlides();
  }

  presentDeleteSetAlert = async (set: ISetData) => {
    const alert = await this.alertController.create({
      header: 'Delete confirmation',
      message: 'Are you sure you want to delete this set?',
      buttons: [
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: 'set-alert-delete-button',
          handler: () => this.deleteSet(set),
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'set-alert-cancel-button',
        },
      ],
      mode: 'ios',
    });

    await alert.present();
  };

  saveWorkout = () => {
    let workoutData = this.getWorkoutData();
    if (this.edit) {
      this.workoutSerivce
        .updateWorkout(workoutData)
        .then((res) => {
          this.modalCtrl.dismiss(null, 'confirm');
        })
        .catch((error) => {
          environment.presentAlert('Saving workout failed', error.message);
        });
    } else {
      this.workoutSerivce
        .addWorkout(workoutData)
        .then((res) => {
          this.modalCtrl.dismiss(null, 'confirm');
        })
        .catch((error) => {
          environment.presentAlert('Saving workout failed', error.message);
        });
    }
  };

  presentAlertBeforeSavingTheWorkout = async () => {
    const alert = await this.alertController.create({
      header: 'Save workout confirmation',
      message: 'Are you sure you want to save this workout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'set-alert-cancel-button',
        },
        {
          text: 'Save',
          role: 'confirm',
          cssClass: 'save-workout-confirm-button',
          handler: () => this.saveWorkout(),
        },
      ],
      mode: 'ios',
    });

    await alert.present();
  };

  onChangedRestBetweenSets() {
    this.restBetweenSets = this.setDurationMinSec(
      this.minRestBetweenSets,
      this.secRestBetweenSets
    );
  }
}
