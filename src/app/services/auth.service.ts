import { inject, Injectable } from '@angular/core';

import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
  updateProfile,
  signOut,
  getAdditionalUserInfo,
} from '@angular/fire/auth';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(AngularFirestore);

  constructor() {}

  async loginWithGoogle(): Promise<UserCredential> {
    const userCredential = await signInWithPopup(
      this.auth,
      new GoogleAuthProvider()
    );

    if (getAdditionalUserInfo(userCredential)?.isNewUser) {
      await this.firestore
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          email: userCredential.user.email,
          displayName: userCredential.user.displayName?.split(' ')[0],
          createdWorkouts: [],
          savedWorkouts: [],
          photoURL: userCredential.user.photoURL?.replace('s96-c', 's400-c'),
        });
    }

    return userCredential;
  }

  async registerWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email.trim(),
      password
    );

    await updateProfile(userCredential.user, {
      displayName: name,
      photoURL:
        'https://source.boringavatars.com/marble/120/' +
        userCredential.user.email,
    });

    await this.firestore
      .collection('users')
      .doc(userCredential.user.uid)
      .set({
        email: userCredential.user.email,
        displayName: name,
        createdWorkouts: [],
        savedWorkouts: [],
        photoURL:
          'https://source.boringavatars.com/marble/120/' +
          userCredential.user.email,
      });

    await signOut(this.auth);

    return userCredential;
  }

  loginWithEmail(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email.trim(), password.trim());
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getCurrentUserFirstName() {
    let currentUser = this.auth.currentUser;
    return currentUser?.displayName?.split(' ')[0];
  }

  getCurremtUserEmail() {
    return this.auth.currentUser?.email;
  }

  getCurremtUserPhotoURL() {
    let photoURL = this.auth.currentUser?.photoURL;
    if (photoURL?.endsWith('s96-c')) {
      photoURL = photoURL.replace('s96-c', 's400-c');
    }
    return photoURL;
  }

  // async resetPassword(email: string) {
  //   return await this.auth.sendPasswordResetEmail(email);
  // }

  // async saveDetails(data: any) {
  //   return await this.firestore.collection('users').doc(data.uid).set(data);
  // }

  // async getDetails(data: any) {
  //   return await this.firestore
  //     .collection('users')
  //     .doc(data.uid)
  //     .valueChanges();
  // }
}
