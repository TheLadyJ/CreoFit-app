import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { IonicSlides } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { AddSetModalComponent } from '../add-set-modal/add-set-modal.component';
import { WorkoutSetSlideComponent } from '../workout-set-slide/workout-set-slide.component';
import { ISetData } from 'src/app/interfaces/WorkoutData';
import { OrdinalPipe } from 'src/app/pipes/ordinal.pipe';
import { DatePipe } from '@angular/common';

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddWorkoutModalComponent implements OnInit {
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

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  private setDurationMinSec(min?: number, sec?: number) {
    let dt = new Date(0, 0, 0, 0, 0, 0, 0);
    dt.setMinutes(min ? min : 0);
    dt.setSeconds(sec ? sec : 0);
    return dt;
  }

  calculatedDuration() {
    let calculatedDuration = new Date(0, 0, 0, 0, 0, 0);
    for (let set of this.workoutSets) {
      for (let exercise of set.exercisesData) {
        if (exercise.duration == null || exercise.duration == undefined) {
          return null;
        } else {
          calculatedDuration.setTime(
            calculatedDuration.getTime() + exercise.duration.getTime()
          );
        }
      }
    }
    return calculatedDuration;
  }

  async onEnterAddSetModal() {
    const modal = await this.modalCtrl.create({
      component: AddSetModalComponent,
      cssClass: 'addSetModal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.workoutSets.push(data);
    }
    console.log(this.workoutSets);
  }

  onCreateWorkout() {
    //checkinput
    //createWorkoutData
    return this.modalCtrl.dismiss('WORKOUT DATA', 'confirm');
  }
}
