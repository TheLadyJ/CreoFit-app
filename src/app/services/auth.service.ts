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
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  constructor() {}

  loginWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  registerWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      email.trim(),
      password.trim()
    ).then((userCredential) => {
      let user = this.getCurrentUser();
      if (user) {
        updateProfile(user, { displayName: name });
      }
      return userCredential;
    });
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
