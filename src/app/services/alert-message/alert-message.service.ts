import { Injectable } from '@angular/core';
import { AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertMessageService {

  constructor(private alertCtrl: AlertController) { }

  //Start Common function for confirmation alert //
  async confirmationAlert(header: string,message: string,cancel: string,ok: string): Promise<boolean> 
    {
          let resolveFunction: (confirm: boolean) => void;
          const promise = new Promise<boolean>(resolve => {
            resolveFunction = resolve;
          });
          const alert = await this.alertCtrl.create({
            header,
            message,
            backdropDismiss: false,
            buttons: [
              {
                text: cancel,
                handler: () => resolveFunction(false)
              },
              {
                text: ok,
                handler: () => resolveFunction(true)
              }
            ]
          });
          await alert.present();
          return promise;
    }
  
  //End Common function for confirmation alert //
  //Start Common function for normal  alert //
  async presentAlert(header: string,message: string) 
    {
          const alert = await this.alertCtrl.create({
            header,
            message,
            buttons: ['OK']
          });

          await alert.present();
    }
  //end Common function for normal  alert //
}
