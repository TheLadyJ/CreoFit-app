// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { inject } from '@angular/core';
import { firebaseConfig } from '../firebaseConfig';
import { AlertController } from '@ionic/angular/standalone';

const presentAlertFunc = async (header: string, message: string) => {
  let alertController = inject(AlertController);
  const alert = await alertController.create({
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
};

export const environment = {
  production: false,
  firebaseConfig: firebaseConfig,
  presentAlert: presentAlertFunc,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
