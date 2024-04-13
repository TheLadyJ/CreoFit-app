import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  loginWithEmail(data: any) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  registerWithEmail(data: any) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.password);
  }

  saveDetails(data: any) {
    return this.firestore.collection('users').doc(data.uid).set(data);
  }

  getDetails(data: any) {
    return this.firestore.collection('users').doc(data.uid).valueChanges();
  }
}
