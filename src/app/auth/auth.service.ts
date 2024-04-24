import { inject, Injectable } from '@angular/core';

import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
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

  registerWithEmail(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      email.trim(),
      password.trim()
    );
  }

  loginWithEmail(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email.trim(), password.trim());
  }

  logout() {
    return signOut(this.auth);
  }

  // async getCurrentUser() {
  //   return await this.auth.currentUser;
  // }

  // async logOut() {
  //   return await this.auth.signOut();
  // }

  // async registerWithEmail(data: any) {
  //   return await this.auth.createUserWithEmailAndPassword(
  //     data.email,
  //     data.password
  //   );
  // }

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
