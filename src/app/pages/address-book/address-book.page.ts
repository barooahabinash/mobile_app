import { Component, OnInit } from '@angular/core';
import { DataService } from './../../api/data.service';
import { NavController} from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.page.html',
  styleUrls: ['./address-book.page.scss'],
})
export class AddressBookPage implements OnInit {
  addressbook_data:any = [];
  viewEntered:boolean=false;
  default_address_id:any=0;

  constructor(private dataService:DataService,private nav: NavController,private ToastService:ToastService,private LoadingService:LoadingService,private AlertMessageService:AlertMessageService,private ApiConnectionService:ApiConnectionService) { }

  ngOnInit() 
    {
    }

  ionViewWillEnter()
    {
          this.load_page_content();
    }
  load_page_content()
    {
          this.addressbook_data=[]
          this.viewEntered=false;
          this.getPageData();
    }
  getPageData()
    {

          let addressbook_url  = '/mobile_app/v1/address_book'
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:addressbook_url}).then(async data => {
            if (data !== undefined && data !='' && data != null){
              console.log(data);
              this.addressbook_data=data.address_book;
              this.default_address_id = data.default_address_id;
              console.log(this.default_address_id);
            }
            this.viewEntered=true;
            this.LoadingService.stopLoading();
          });
      
    }
  async delete_address(address_id:any,is_default:any)
    {
          const confirmreslt = await this.AlertMessageService.confirmationAlert(
            'Confirmation','Are you sure want to delete this address?','Cancel','Delete'
          );

          if(!confirmreslt)
          {
            return;
          }
          if(confirmreslt)
          {
            if(is_default == 'Y')
            {
              this.ToastService.presentToastMsg("Sorry, you cannot delete your default address");
            }else
            {
                this.LoadingService.showLoading();
                let addressdeleteUrl = '/mobile_app/v1/address_delete/'+ address_id;
                this.ApiConnectionService.post({url:addressdeleteUrl}).then(data => {
                this.LoadingService.stopLoading();
                if (data !== undefined && data !='' && data != null){
                  if(data.success == false)
                  {
                    this.ToastService.presentToastMsg(""+data.error_message);
                    
                  }else{
                    this.ToastService.presentToastMsg("The address has been removed from your address book");
                    this.load_page_content();
                  }
                }
              });
            }
              
          }

    }
  
  addNewAddress()
    {
          this.nav.navigateForward(this.dataService.tab_menu_path+'/address');
    }
  edit_address(address_id:any)
    {
          this.nav.navigateForward(this.dataService.tab_menu_path+'/address', { state: address_id});
    }

  change_default_address(address_id:any,address_1:any,address_2:any)
    {
          
          this.LoadingService.showLoading();
          let addresschangeUrl = '/mobile_app/v1/change_default_address/'+ address_id;
          this.ApiConnectionService.post({url:addresschangeUrl}).then(data => {
            this.LoadingService.stopLoading();
          if (data !== undefined && data !='' && data != null){
            if(data.success == true)
            {
              this.ToastService.presentToastMsg(address_1+" "+address_2+" has been set as your default address");
              this.load_page_content();
            }else{
              this.ToastService.presentToastMsg("Something wrong,try again.");
            }
          }
        });

    }
  retry_page_content()
    {
      this.ApiConnectionService.networkConnectionCheck();
      this.load_page_content();
    }
}
