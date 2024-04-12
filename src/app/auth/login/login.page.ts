import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import {
  mailOutline,
  keyOutline,
  eyeOffOutline,
  eyeOutline,
  logoGoogle,
} from 'ionicons/icons';

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

  constructor() {
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
    console.log(this.form.value);
  }

  onGoogleLogin() {}
}
