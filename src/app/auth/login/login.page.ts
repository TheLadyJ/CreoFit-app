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
  LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, keyOutline, logoGoogle } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

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

  constructor(
    public authService: AuthService,
    public router: Router,
    private alertService: AlertService,
    private loadingCtrl: LoadingController
  ) {
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
    this.loadingCtrl
      .create({ message: 'Logging in...', mode: 'ios' })
      .then((loadingEl) => {
        loadingEl.present();
        this.authService
          .loginWithEmail(email, password)
          .then((res) => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
          })
          .catch((error) => {
            loadingEl.dismiss();
            let message = this.authService.getErrorMessage(error.code);
            this.alertService.presentAlert('Login Failed', message);
          });
      });
  }

  onGoogleLogin() {
    this.authService
      .loginWithGoogle()
      .then((res) => {
        this.form.reset();
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      })
      .catch((error) => {
        let message = this.authService.getErrorMessage(error.code);
        this.alertService.presentAlert('Login Failed', message);
      });
  }
}
