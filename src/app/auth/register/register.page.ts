import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
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
  LoadingController,
} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { keyOutline, mailOutline, personOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

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

  constructor(
    public authService: AuthService,
    public router: Router,
    private alertService: AlertService,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ mailOutline, keyOutline, personOutline });
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: [this.checkPasswords('password', 'confirmPassword')] }
    );
  }
  private checkPasswords(
    firstPassword: string,
    secondPassword: string
  ): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(firstPassword);
      const matchControl = controls.get(secondPassword);

      if (!matchControl?.errors && control?.value !== matchControl?.value) {
        matchControl?.setErrors({
          matchingPasswords: {
            actualValue: matchControl?.value,
            requiredValue: control?.value,
          },
        });
        return { matchingPasswords: true };
      }
      return null;
    };
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
    this.loadingCtrl
      .create({ message: 'Registering...', mode: 'ios' })
      .then((loadingEl) => {
        loadingEl.present();

        this.authService
          .registerWithEmail(email, password, name)
          .then((res) => {
            loadingEl.dismiss();
            this.alertService.presentAlert(
              'Successesful Registration',
              'You successfully registered!'
            );
            this.form.reset();
            this.router.navigateByUrl('/login', { replaceUrl: true });
          })
          .catch((error) => {
            loadingEl.dismiss();
            let message: string = this.authService.getErrorMessage(error.code);
            this.alertService.presentAlert('Registration Failed', message);
          });
      });
  }
}
