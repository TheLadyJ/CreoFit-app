import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'set-alert-cancel-button',
        },
      ],
      mode: 'ios',
    });

    await alert.present();
  }
}
