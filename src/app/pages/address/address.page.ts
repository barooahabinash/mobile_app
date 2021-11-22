import { Component, OnInit } from '@angular/core';
import { NavController,PickerController} from '@ionic/angular';
import { DataService } from './../../api/data.service'; 
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AddressService } from 'src/app/services/address/address.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  fullName:string;
  phoneNumber:string;
  houseNumber:string;
  addressLine1:string;
  addressLine2:string;
  town:string;
  county:string;
  postcode:string;
  addresserrorflag:boolean=false;
  addresserrormsg:string;
  postcodeerrorflag:boolean=false;
  address_lookup_status:boolean=false;
  postal_address_ids:any=[];
  customer_address_id:any=0;

  constructor(private nav: NavController,private dataService:DataService,private pickerController: PickerController,public router: Router,private ToastService:ToastService,private LoadingService:LoadingService,private AddressService:AddressService,private ApiConnectionService:ApiConnectionService ) {

    if (router.getCurrentNavigation().extras.state) {
     this.customer_address_id = this.router.getCurrentNavigation().extras.state;
     }

   }

  ngOnInit() 
    {
          this.load_page_content();
    }
  load_page_content()
    {
          this.address_lookup_status=this.dataService.address_lookup;
          if(this.customer_address_id > 0)
          {
                  this.LoadingService.showLoading();
                  let addresschangeUrl = '/mobile_app/v1/get_address_by_addressid/'+ this.customer_address_id;
                  this.ApiConnectionService.post({url:addresschangeUrl}).then(data => {
                  this.LoadingService.stopLoading();
                  if (data !== undefined && data !='' && data != null){
                    this.fullName=data.address_details.name;
                    this.houseNumber=data.address_details.house_no;
                    this.addressLine1=data.address_details.address_1;
                    this.addressLine2=data.address_details.address_2;
                    this.town=data.address_details.town;
                    this.county=data.address_details.county;
                    this.postcode=data.address_details.postcode;
                    this.phoneNumber=data.address_details.telephone;
                  
                  }
                });
          }
    }
  addAddress()
    {
            if(this.fullName.trim() == "" || this.phoneNumber =="" ||  this.houseNumber.trim() =="" || this.addressLine1.trim() =="" || this.town.trim() =="" || this.county.trim() =="" || this.postcode.trim() =="")
            {
            this.addresserrorflag=true;
            this.addresserrormsg="Please Fill In The Required Fields";
            }else{
                  this.LoadingService.showLoading();
                  this.addresserrorflag=false;

                  this.AddressService.addEditAddress({
                                    name : this.fullName,
                                    phone : this.phoneNumber,
                                    house : this.houseNumber,
                                    line1 : this.addressLine1,
                                    line2 : this.addressLine2,
                                    town : this.town,
                                    county : this.county,
                                    postcode : this.postcode,
                                    address_id : this.customer_address_id 
                                  }).then(data => {
                  
                        this.LoadingService.stopLoading();
                        if (data !== undefined && data !='' && data != null){
                              if (data.success === true)
                              {
                                this.AddressService.newAddressAdded = true;
                                if(this.customer_address_id > 0)
                                  {
                                  this.ToastService.presentToastMsg("Your address has been updated.");
                                  }else
                                  {
                                    this.ToastService.presentToastMsg("New address has been added.");
                                  }
                                this.nav.back();
                              }else{
                              if(data.error_message!='')
                              {
                                this.addresserrorflag=false;
                                this.addresserrormsg=data.error_message;
                              }
                            }
                        }
                    });
          }
    }

  find_postcode_id()
    {
      
            if(this.postcode.trim() =="")
            {
              this.addresserrorflag=true;
              this.postcodeerrorflag=true;
              this.addresserrormsg="Please Enter a Postcode";
            }else{

                this.postal_address_ids=[];
                let product_url  = '/mobile_app/v1/postcode_lookup/' + this.postcode;
                this.addresserrorflag=false;
                this.postcodeerrorflag=false;
                this.LoadingService.showLoading();
                this.ApiConnectionService.post({url:product_url}).then(async data => {
                this.LoadingService.stopLoading();
                  if (data !== undefined && data !='' && data != null){
                        if (data.addresses !== undefined && data.addresses.length >0){
                          this.postal_address_ids= data.addresses;
                          this.openAddressPicker();
                        }else if(data.addresses !== undefined && data.addresses.length ==0)
                        {
                          this.addresserrorflag=true;
                          this.postcodeerrorflag=true;
                          this.addresserrormsg="No Address Results Found.";
                        
                        }else
                        {
                          this.openAddressPicker();
                        }
                    }
                  
                });
                
          }
    }
    
  find_address(address_id:any)
    {
          let product_url  = '/mobile_app/v1/premise_lookup/' + address_id;
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:product_url}).then(async data => {
            this.LoadingService.stopLoading();
            if (data !== undefined && data !='' && data != null){
              this.houseNumber = data.address.house
              this.addressLine1= data.address.line1;
              this.addressLine2 = data.address.line2;
              this.town         = data.address.town;
              this.county      = data.address.county;
              this.postcode     = data.address.postcode;
            }
          
            this.address_lookup_status=false;
          });
    }
  async openAddressPicker()
    {
          let options = {
            buttons: [
              {
                text: "Cancel",
                role: 'cancel'
              },
              {
                text:'Done',
                role:'apply',
                handler:(value:any) => {
                  var selectedIndex:any = Object.values (value);
                  if(selectedIndex[0].value == 0)//Enter Manually
                  {
                    var temp_postcode=this.postcode;
                    this.clearAddressSection();
                    this.postcode=temp_postcode;
                    this.address_lookup_status=false;
                  }else
                  {
                    this.find_address(selectedIndex[0].value);
                  }
                  
                }
              }
            ],
            columns:[{
              name:'Address',
              options:this.getAddressColumnOptions()
            }]
          };

          const picker = await this.pickerController.create(options);
          await picker.present()
          picker.onDidDismiss().then((result) =>{
            if(result.role !='apply' && result.role !='cancel')
              {
                if(this.postal_address_ids.length >0)
                {
                  this.find_address(this.postal_address_ids[0].id);
                }
                
              }
          })
    }

  getAddressColumnOptions()
    {
          let options = [];
            if(this.postal_address_ids.length > 0)
              {
                  this.postal_address_ids.forEach(function(val){
                    options.push({text:val.description,value:val.id});
                  });
              }
            options.push({text:'Enter Manually',value:0});
            return options;
    } 
  clearAddressSection()
    {
          this.houseNumber  = "";
          this.addressLine1 = "";
          this.addressLine2 = "";
          this.town         = "";
          this.county       = "";
          this.postcode     = "";
    }
  retry_page_content()
    {
          this.ApiConnectionService.networkConnectionCheck();
          this.load_page_content();
    }
}
