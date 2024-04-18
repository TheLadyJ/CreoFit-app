import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonItem,
  IonInput,
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, keyOutline, logoGoogle } from 'ionicons/icons';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonText,
    IonInput,
    IonItem,
    IonCard,
    IonContent,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class LoginPage {
  form!: FormGroup;
  isPwd = false;

  constructor(public authService: AuthService, public router: Router) {
    addIcons({ mailOutline, keyOutline, logoGoogle });
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.login(
      this.form.controls['email'].value,
      this.form.controls['password'].value
    );
  }

  login(email: string, password: string) {
    this.authService
      .loginWithEmail(email, password)
      .then((res) => {
        console.log(res);
        this.router.navigate(['/tabs']);
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  }

  onGoogleLogin() {
    this.authService
      .loginWithGoogle()
      .then((res) => {
        console.log(res);
        this.router.navigate(['/tabs']);
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  }
}
