import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { IUser } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(AngularFirestore);

  constructor() {}

  getUserById(userId: string): Observable<IUser> {
    return this.firestore
      .collection('users')
      .doc(userId)
      .valueChanges()
      .pipe(
        map((user: any) => {
          if (user) {
            return {
              displayName: user.displayName,
              email: user.email,
              savedWorkouts: user.savedWorkouts || [],
              createdWorkouts: user.createdWorkouts || [],
              photoURL: user.photoURL,
            };
          } else {
            return {
              displayName: '',
              email: '',
              savedWorkouts: [],
              createdWorkouts: [],
              photoURL: '',
            };
          }
        })
      );
  }
}
