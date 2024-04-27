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
      .collection('users', (ref) => ref.where('userId', '==', userId))
      .valueChanges()
      .pipe(
        map((users: any[]) => {
          if (users.length > 0) {
            const userData = users[0];
            return {
              displayName: userData.displayName,
              email: userData.email,
              savedWorkouts: userData.savedWorkouts || [],
              createdWorkouts: userData.createdWorkouts || [],
              photoURL: userData.photoURL,
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
