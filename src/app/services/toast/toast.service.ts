import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  /**
     * Presents a toast to the user containing the message provided.
     * 
     * @param message 
     */
  async presentToastMsg(message:string,pos?: string,css?:string, btns?: Object[]) 
    {
          const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            cssClass: css ? css : '',
            buttons: btns ? btns : [],
            position: pos === "bottom" ? pos : 'top'
            //position: css && css.includes('big-toast') ? 'bottom' : 'top'
        })
          //Adjust the styling of the content of the toast by accessing the shadow DOM.
          //This needs to be done in JS as the shadow DOM cannot be accessed via CSS.
          const bigToast = document.querySelector('.big-toast');
          if (bigToast) {
            const shadowRoot = bigToast.shadowRoot;
            
            shadowRoot.querySelector('.toast-wrapper').setAttribute('style', 'height: 150px;');
            shadowRoot.querySelector('.toast-container').setAttribute('style', 'display: block; height: 100%;');
            shadowRoot.querySelector('.toast-content').setAttribute('style', 'text-align: center; display: flex; margin: auto; margin-top: 12px; ');
            shadowRoot.querySelector('.toast-message').setAttribute('style', 'display: flex; margin: auto;');
            shadowRoot.querySelector('.toast-content ion-icon').setAttribute('style', 'font-size: 18px; color: green;');
            shadowRoot.querySelector('.toast-button-group').setAttribute('style', 'margin-top: 10px; justify-content: center;');
            shadowRoot.querySelector('.toast-button-inner').setAttribute('style', 'margin: auto;');
            shadowRoot.querySelector('.big-toast-button')
            .setAttribute(
              'style', 
              'padding-right: 15px; padding-left: 15px; border-radius: 12px; background: rgb(82, 96, 255); width: 85%; display: flex;'
              );
              
        
          }

          toast.present();
    }

}
