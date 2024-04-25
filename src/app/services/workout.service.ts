import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private firestore = inject(AngularFirestore);

  constructor() {}
}
