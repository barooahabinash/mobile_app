import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { DataService } from './../../api/data.service';
import { PickerController} from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Component({
  selector: 'app-login-registration',
  templateUrl: './login-registration.component.html',
  styleUrls: ['./login-registration.component.scss'],
})
export class LoginRegistrationComponent implements OnInit {
  @Output() addingtowishlist = new EventEmitter();

  username:string;
  password:string;
  fullName:string;
  email:string;
  registerPassword:string;
  phoneNumber:string;
  houseNumber:string;
  addressLine1:string;
  addressLine2:string;
  town:string;
  county:string;
  postcode:string;

  postcodeerrorflag:boolean=false;
  postal_address_ids:any=[];
  address_lookup_status:boolean=false;

  constructor(private dataService:DataService,private ToastService:ToastService,private pickerController: PickerController,private LoadingService:LoadingService,private AlertMessageService:AlertMessageService,private StorageService:StorageService,private AuthenticationService:AuthenticationService,private RegistrationService:RegistrationService,private ApiConnectionService:ApiConnectionService) { }

  ngOnInit() 
    {

          this.address_lookup_status=this.dataService.address_lookup;

    }
  async ionViewWillEnter()
    {
          this.address_lookup_status=this.dataService.address_lookup;
    }

  login()
    {
          this.AuthenticationService.login(
            this.username, 
            this.password
          );
          if(this.addingtowishlist.observers.length > 0) //Adding product to wishlist from product detail page
          {
            this.addingtowishlist.emit();
          }
    }
    register()
      {

            if(this.fullName.trim() == "" || this.email.trim() == "" || this.phoneNumber =="" ||  this.houseNumber.trim() =="" || this.addressLine1.trim() =="" || this.town.trim() =="" || this.county.trim() =="" || this.postcode.trim() =="")
            {
            this.RegistrationService.registrationerrorflag=true;
            this.RegistrationService.registrationerrormsg="Please Fill In The Required Fields";
            }else{
              
                    this.RegistrationService.register({
                      name: this.fullName,
                      email: this.email,
                      password: this.registerPassword,
                      phone: this.phoneNumber,
                      house: this.houseNumber,
                      line1: this.addressLine1,
                      line2: this.addressLine2,
                      town: this.town,
                      county: this.county,
                      postcode: this.postcode
                    });  
                    if(this.addingtowishlist.observers.length > 0) //Adding product to wishlist from product detail page
                    {
                      this.addingtowishlist.emit();
                    }
              }
      }
    
  find_postcode_id()
    {
      
            if(this.postcode.trim() =="")
            {
              this.RegistrationService.registrationerrorflag=true;
              this.postcodeerrorflag=true;
              this.RegistrationService.registrationerrormsg="Please Enter a Postcode";
            }else{
            /* for testing */
            /* var addres={"addresses":[{"id":"1338000.00","description":"2 Marlton Road Blackburn"},{"id":"1337995.00","description":"1-3 Marlton Road Blackburn"},{"id":"1338011.00","description":"4 Marlton Road Blackburn"},{"id":"1338017.00","description":"5 Marlton Road Blackburn"},{"id":"1338023.00","description":"6 Marlton Road Blackburn"},{"id":"1338029.00","description":"7 Marlton Road Blackburn"},{"id":"1338036.00","description":"8 Marlton Road Blackburn"},{"id":"1338042.00","description":"9 Marlton Road Blackburn"},{"id":"1337986.00","description":"10 Marlton Road Blackburn"},{"id":"1337992.00","description":"11 Marlton Road Blackburn"},{"id":"1337994.00","description":"12 Marlton Road Blackburn"},{"id":"1337996.00","description":"13 Marlton Road Blackburn"},{"id":"1337997.00","description":"14 Marlton Road Blackburn"},{"id":"1337998.00","description":"16 Marlton Road Blackburn"},{"id":"1337999.00","description":"18 Marlton Road Blackburn"},{"id":"1338001.00","description":"20 Marlton Road Blackburn"},{"id":"1338002.00","description":"22 Marlton Road Blackburn"},{"id":"1338003.00","description":"24 Marlton Road Blackburn"},{"id":"1338004.00","description":"26 Marlton Road Blackburn"},{"id":"1338005.00","description":"28 Marlton Road Blackburn"},{"id":"1338006.00","description":"30 Marlton Road Blackburn"},{"id":"1338007.00","description":"32 Marlton Road Blackburn"},{"id":"1338008.00","description":"34 Marlton Road Blackburn"},{"id":"1338009.00","description":"36 Marlton Road Blackburn"},{"id":"1338010.00","description":"38 Marlton Road Blackburn"},{"id":"1338012.00","description":"40 Marlton Road Blackburn"},{"id":"1338013.00","description":"42 Marlton Road Blackburn"},{"id":"1338014.00","description":"44 Marlton Road Blackburn"},{"id":"1338015.00","description":"46 Marlton Road Blackburn"},{"id":"1338016.00","description":"48 Marlton Road Blackburn"},{"id":"1338018.00","description":"50 Marlton Road Blackburn"},{"id":"1338019.00","description":"52 Marlton Road Blackburn"},{"id":"1338020.00","description":"54 Marlton Road Blackburn"},{"id":"1338021.00","description":"56 Marlton Road Blackburn"},{"id":"1338022.00","description":"58 Marlton Road Blackburn"},{"id":"1338024.00","description":"60 Marlton Road Blackburn"},{"id":"1338025.00","description":"62 Marlton Road Blackburn"},{"id":"1338026.00","description":"64 Marlton Road Blackburn"},{"id":"1338027.00","description":"66 Marlton Road Blackburn"},{"id":"1338028.00","description":"68 Marlton Road Blackburn"},{"id":"1338030.00","description":"70 Marlton Road Blackburn"},{"id":"1338031.00","description":"72 Marlton Road Blackburn"},{"id":"1338032.00","description":"74 Marlton Road Blackburn"},{"id":"1338033.00","description":"76 Marlton Road Blackburn"},{"id":"1338034.00","description":"76A Marlton Road Blackburn"},{"id":"1338035.00","description":"78 Marlton Road Blackburn"},{"id":"1338037.00","description":"80 Marlton Road Blackburn"},{"id":"1338038.00","description":"82 Marlton Road Blackburn"},{"id":"1338039.00","description":"84 Marlton Road Blackburn"},{"id":"1338040.00","description":"86 Marlton Road Blackburn"},{"id":"1338041.00","description":"88 Marlton Road Blackburn"},{"id":"1338043.00","description":"90 Marlton Road Blackburn"},{"id":"1338044.00","description":"92 Marlton Road Blackburn"},{"id":"1338045.00","description":"94 Marlton Road Blackburn"},{"id":"1338046.00","description":"96 Marlton Road Blackburn"},{"id":"1338047.00","description":"98 Marlton Road Blackburn"},{"id":"1337987.00","description":"100 Marlton Road Blackburn"},{"id":"1337988.00","description":"102 Marlton Road Blackburn"},{"id":"1337989.00","description":"104 Marlton Road Blackburn"},{"id":"1337990.00","description":"106 Marlton Road Blackburn"},{"id":"1337991.00","description":"108 Marlton Road Blackburn"},{"id":"1337993.00","description":"110 Marlton Road Blackburn"}]};
            this.postal_address_ids= addres.addresses;
            console.log(this.postal_address_ids);
            this.openColourPicker();
            */
            
                this.postal_address_ids=[];
                let product_url  = '/mobile_app/v1/postcode_lookup/' + this.postcode;
                this.RegistrationService.registrationerrorflag=false;
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
                        this.RegistrationService.registrationerrorflag=true;
                        this.postcodeerrorflag=true;
                        this.RegistrationService.registrationerrormsg="No Address Results Found.";
                      
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
              name:'Colours',
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

}
