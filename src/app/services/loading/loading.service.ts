import { Injectable } from '@angular/core';

import { LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading:any;

  constructor(private loadingController: LoadingController) { }


  async showLoading() 
    {
          this.loading =''; 
          this.loading = await this.loadingController.create({
            spinner: "circles",
            translucent: false,
            cssClass: 'custom-class custom-loading',
            backdropDismiss: true,
            duration: 3000
          });
          await this.loading.present();
    }
    
  async stopLoading() 
    {
          //const { role, data } = await this.loading.onDidDismiss();
          //await this.loading.dismiss();
          if(this.loading !=undefined && this.loading !='')
          {
            await this.loadingController.dismiss();
          }
    }
}
