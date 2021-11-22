import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { StorageService } from '../storage/storage.service';
import { DataService } from 'src/app/api/data.service';
import { LoadingService } from '../loading/loading.service';
import { Registration } from 'src/app/interfaces/registration.interface';
import { ApiConnectionService } from '../api-connection/api-connection.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  registrationerrorflag:boolean=false;
  registrationerrormsg:string;

  constructor(private AuthenticationService:AuthenticationService,private StorageService:StorageService,private dataService:DataService,private LoadingService:LoadingService,private ApiConnectionService:ApiConnectionService) { }


  register(registrationData: Registration)
    {

            this.LoadingService.showLoading();
            this.registrationerrorflag=false;
            const postData = {
              register_info: JSON.stringify(registrationData)
            };

                  
                    this.ApiConnectionService.post({url: '/mobile_app/v1/register',postParams: postData}).then(data => {
                        this.LoadingService.stopLoading();
                      if (data !== undefined && data !='' && data != null){
                          if (data.success === true)
                          {
                            this.StorageService.set('vs_login', 'true');
                            this.StorageService.set('vs_userloginemail', registrationData.email);
                            this.AuthenticationService.userHasLogged = true;
                            this.AuthenticationService.loggeduserEmail= registrationData.email;
                            this.AuthenticationService.isUserLoggedIn.next(true);
                            this.AuthenticationService.getLoggedInStatus();
                            
                          }else{
                            if(data.error_message!='')
                            {
                              this.registrationerrorflag=true;
                              this.registrationerrormsg=data.error_message;
                            }
                          }
                      }
                    });
        
    }
}
