import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonItem,
  IonInput,
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { keyOutline, mailOutline, personOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage {
  form!: FormGroup;
  isPwd = false;

  constructor(public authService: AuthService, public router: Router) {
    addIcons({ mailOutline, keyOutline, personOutline });
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.register(
      this.form.controls['email'].value,
      this.form.controls['password'].value,
      this.form.controls['name'].value
    );
  }

  register(email: string, password: string, name: string) {
    this.authService
      .registerWithEmail(email, password, name)
      .then((res) => {
        environment.presentAlert(
          'Successesful Registration',
          'You successfully registered!'
        );
        this.router.navigateByUrl('/login', { replaceUrl: true });
      })
      .catch((error) => {
        environment.presentAlert('Registration Failed', error.message);
      });
  }
}
