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
  signInWithCredential,
} from '@angular/fire/auth';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(AngularFirestore);

  constructor() {
    GoogleAuth.initialize();
  }

  // async loginWithGoogle(): Promise<UserCredential> {
  //   const userCredential = await signInWithPopup(
  //     this.auth,
  //     new GoogleAuthProvider()
  //   );

  //   if (getAdditionalUserInfo(userCredential)?.isNewUser) {
  //     await this.firestore
  //       .collection('users')
  //       .doc(userCredential.user.uid)
  //       .set({
  //         email: userCredential.user.email,
  //         displayName: userCredential.user.displayName?.split(' ')[0],
  //         createdWorkouts: [],
  //         savedWorkouts: [],
  //         photoURL: userCredential.user.photoURL?.replace('s96-c', 's400-c'),
  //       });
  //   }

  //   return userCredential;
  // }

  userDocumentExists(userId: string): Observable<boolean> {
    const docRef = this.firestore
      .collection('users')
      .doc(userId)
      .snapshotChanges();
    return docRef.pipe(map((doc) => doc.payload.exists));
  }

  // Logging in with @codetrix-studio/capacitor-google-auth

  async loginWithGoogle() {
    const user = await GoogleAuth.signIn();
    this.userDocumentExists(user.id);
    const credential = GoogleAuthProvider.credential(
      user.authentication.idToken,
      user.authentication.accessToken
    );
    await signInWithCredential(this.auth, credential);
    if (this.auth.currentUser) {
      this.userDocumentExists(this.auth.currentUser.uid).subscribe((exist) => {
        if (!exist) {
          this.firestore
            .collection('users')
            .doc(this.auth.currentUser?.uid)
            .set({
              email: this.auth.currentUser?.email,
              displayName: this.auth.currentUser?.displayName?.split(' ')[0],
              savedWorkouts: [],
              photoURL: this.auth.currentUser?.photoURL?.replace(
                's96-c',
                's400-c'
              ),
            });
        } else {
          this.firestore
            .collection('users')
            .doc(this.auth.currentUser?.uid)
            .update({
              email: this.auth.currentUser?.email,
              displayName: this.auth.currentUser?.displayName?.split(' ')[0],
              photoURL: this.auth.currentUser?.photoURL?.replace(
                's96-c',
                `s400-c`
              ),
            });
        }
      });
    }
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

  getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/claims-too-large':
        'The claims payload provided to setCustomUserClaims() exceeds the maximum allowed size of 1000 bytes.',
      'auth/email-already-in-use':
        'The email address is already in use by another account.',
      'auth/email-already-exists':
        'The provided email is already in use by an existing user. Each user must have a unique email.',
      'auth/id-token-expired': 'The provided Firebase ID token is expired.',
      'auth/id-token-revoked': 'The Firebase ID token has been revoked.',
      'auth/insufficient-permission':
        'The credential used to initialize the Admin SDK has insufficient permission to access the requested Authentication resource.',
      'auth/internal-error':
        'The Authentication server encountered an unexpected error while trying to process the request.',
      'auth/invalid-argument':
        'An invalid argument was provided to an Authentication method.',
      'auth/invalid-claims':
        'The custom claim attributes provided to setCustomUserClaims() are invalid.',
      'auth/invalid-continue-uri':
        'The continue URL must be a valid URL string.',
      'auth/invalid-creation-time':
        'The creation time must be a valid UTC date string.',
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/invalid-disabled-field':
        'The provided value for the disabled user property is invalid. It must be a boolean.',
      'auth/invalid-display-name':
        'The provided value for the displayName user property is invalid. It must be a non-empty string.',
      'auth/invalid-dynamic-link-domain':
        'The provided dynamic link domain is not configured or authorized for the current project.',
      'auth/invalid-email': 'Invalid email.',
      'auth/invalid-email-verified':
        'The provided value for the emailVerified user property is invalid. It must be a boolean.',
      'auth/invalid-hash-algorithm':
        'The hash algorithm must match one of the strings in the list of supported algorithms.',
      'auth/invalid-hash-block-size':
        'The hash block size must be a valid number.',
      'auth/invalid-hash-derived-key-length':
        'The hash derived key length must be a valid number.',
      'auth/invalid-hash-key': 'The hash key must a valid byte buffer.',
      'auth/invalid-hash-memory-cost':
        'The hash memory cost must be a valid number.',
      'auth/invalid-hash-parallelization':
        'The hash parallelization must be a valid number.',
      'auth/invalid-hash-rounds': 'The hash rounds must be a valid number.',
      'auth/invalid-hash-salt-separator':
        'The hashing algorithm salt separator field must be a valid byte buffer.',
      'auth/invalid-id-token':
        'The provided ID token is not a valid Firebase ID token.',
      'auth/invalid-last-sign-in-time':
        'The last sign-in time must be a valid UTC date string.',
      'auth/invalid-page-token':
        'The provided next page token in listUsers() is invalid. It must be a valid non-empty string.',
      'auth/invalid-password':
        'The provided value for the password user property is invalid. It must be a string with at least six characters.',
      'auth/invalid-password-hash':
        'The password hash must be a valid byte buffer.',
      'auth/invalid-password-salt':
        'The password salt must be a valid byte buffer.',
      'auth/invalid-phone-number':
        'The provided value for the phoneNumber is invalid. It must be a non-empty E.164 standard compliant identifier string.',
      'auth/invalid-photo-url':
        'The provided value for the photoURL user property is invalid. It must be a string URL.',
      'auth/invalid-provider-data':
        'The providerData must be a valid array of UserInfo objects.',
      'auth/invalid-provider-id':
        'The providerId must be a valid supported provider identifier string.',
      'auth/invalid-oauth-responsetype':
        'Only exactly one OAuth responseType should be set to true.',
      'auth/invalid-session-cookie-duration':
        'The session cookie duration must be a valid number in milliseconds between 5 minutes and 2 weeks.',
      'auth/invalid-uid':
        'The provided uid must be a non-empty string with at most 128 characters.',
      'auth/invalid-user-import': 'The user record to import is invalid.',
      'auth/maximum-user-count-exceeded':
        'The maximum allowed number of users to import has been exceeded.',
      'auth/missing-android-pkg-name':
        'An Android Package Name must be provided if the Android App is required to be installed.',
      'auth/missing-continue-uri':
        'A valid continue URL must be provided in the request.',
      'auth/missing-hash-algorithm':
        'Importing users with password hashes requires that the hashing algorithm and its parameters be provided.',
      'auth/missing-ios-bundle-id': 'The request is missing a Bundle ID.',
      'auth/missing-uid':
        'A uid identifier is required for the current operation.',
      'auth/missing-oauth-client-secret':
        'The OAuth configuration client secret is required to enable OIDC code flow.',
      'auth/operation-not-allowed':
        'Password sign-in is disabled for this project.',
      'auth/phone-number-already-exists':
        'The provided phoneNumber is already in use by an existing user. Each user must have a unique phoneNumber.',
      'auth/project-not-found':
        'No Firebase project was found for the credential used to initialize the Admin SDKs.',
      'auth/reserved-claims':
        'One or more custom user claims provided to setCustomUserClaims() are reserved.',
      'auth/session-cookie-expired':
        'The provided Firebase session cookie is expired.',
      'auth/session-cookie-revoked':
        'The Firebase session cookie has been revoked.',
      'auth/too-many-requests':
        'The number of requests exceeds the maximum allowed.',
      'auth/uid-already-exists':
        'The provided uid is already in use by an existing user. Each user must have a unique uid.',
      'auth/unauthorized-continue-uri':
        'The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase Console.',
      'auth/user-not-found':
        'There is no existing user record corresponding to the provided identifier.',
    };

    return (
      errorMessages[errorCode] ||
      'An unexpected error occurred. Please try again later.'
    );
  }
}
