import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { LoadingService } from '../loading/loading.service';
import { DataService } from 'src/app/api/data.service';
import { ToastService } from '../toast/toast.service';
import { AlertMessageService } from '../alert-message/alert-message.service';
import { ApiConnectionService } from '../api-connection/api-connection.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userHasLogged:boolean;
  loggeduserEmail:string;
  loginerrorflag:boolean=false;
  login_forgot_password_errormsg:any='';
  existing_customer_flag:boolean=true;
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // used in wishlist page & chckout page .When client login through whislist cart section,this variable used to reload whishlist page
 
  constructor(private StorageService:StorageService,private LoadingService:LoadingService,private dataService:DataService,private ToastService:ToastService,private AlertMessageService:AlertMessageService,private ApiConnectionService:ApiConnectionService) { }

  async getLoggedInStatus()
    {
          this.userHasLogged = await this.StorageService.get('vs_login');
          this.loggeduserEmail = await this.StorageService.get('vs_userloginemail');
    }


  login(username: string, password: string)
    {

          this.loginerrorflag=false;
          this.login_forgot_password_errormsg='';
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:'/mobile_app/v1/login',postParams:{username: username,password: password}}).then(data => {
              this.LoadingService.stopLoading();
              if (data !== undefined && data !='' && data != null){
                  if (data.success === true)
                  {
                  
                    this.StorageService.set('vs_login', 'true');
                    this.StorageService.set('vs_userloginemail',username);
                    this.userHasLogged = true;
                    this.loggeduserEmail= username;
                    this.isUserLoggedIn.next(true);
                    this.getLoggedInStatus();
                  
                  }else
                  {
                    this.loginerrorflag=true;
                    this.login_forgot_password_errormsg='Incorrect Log In Details';
                  }
              }
              
            });
    }
  async logout()
    {
            const confirmreslt = await this.AlertMessageService.confirmationAlert(
              'Confirmation','Are you sure want to log out?','Cancel','Log Out'
            );
            
            if(!confirmreslt)
            {
              return;
            }
          if(confirmreslt)
            {
                  this.LoadingService.showLoading();
                  this.ApiConnectionService.post({url:'/mobile_app/v1/logout'}).then(async data => {
                    this.LoadingService.stopLoading();
                    if (data !== undefined && data !='' && data != null){
                      this.StorageService.set('vs_login', 'false');
                      this.StorageService.set('vs_userloginemail','');
                      this.StorageService.remove('vs_login');
                      this.StorageService.remove('vs_userloginemail');
                      this.ToastService.presentToastMsg("Logged out successfully");
                      // use below if navigate back is not reqd
                        this.userHasLogged = false;
                      //this.nav.pop();
                    }
                  });
          }
    }


  existingcustomer_forgotpassword(status:boolean)//false- forgot password,true-existing customer
    {
          this.loginerrorflag=false; 
          this.existing_customer_flag=status;
          this.login_forgot_password_errormsg='';

    }
  send_password_email(email:string) 
    {
          this.loginerrorflag=false;
          this.login_forgot_password_errormsg='';
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:'/mobile_app/v1/forgot_password',postParams: {email: email}}).then(data => {
              this.LoadingService.stopLoading();
              if (data !== undefined && data !='' && data != null){
                  if (data.success === true)
                  {
                    this.loginerrorflag=false;
                    this.login_forgot_password_errormsg='';
                    this.ToastService.presentToastMsg("Password Email Sent");
                    this.existingcustomer_forgotpassword(true);
                  }else
                  {
                    this.loginerrorflag=true;
                    this.login_forgot_password_errormsg=data.error_message;
                  }
            }
            });
    }

}
