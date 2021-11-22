import { Router,NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from './../../api/data.service'; 
import { NavController,PickerController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subscription } from 'rxjs';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';
import { AddressService } from 'src/app/services/address/address.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {



  discountapplyerrormsg:any;
  delivery_day_array:any;
  delivery_date_day_title:string="Choose Delivery Day";

  discountCode:string;

  itemsIncart:any = [];
  itemsArray:any = [];
  failedproductArray:any = [];
  alteredproductArray:any = [];
  alteredqtyproductArray:any = [];
  alteredpriceproductArray:any = [];
  alteredqtypriceproductArray:any = [];
  
  addressesArray:any = [];
  couriersArray:any = [];
  discountCodesArray:any = [];
  totalItems:string;
  subTotal:string;
  selected_address:string;
  selected_delivery_day:string;
  courier_price:string = '0.00';
  selected_courier:string;
  flash_message:string;
  total_amount:string;
  discount_total:string;
  viewEntered:boolean=false;
  cookieArray:any = [];
  sessionCookie:string;
  terms_condition_link:string="";
  option_settings:any=[];
  option_settings_currency:any=[];

  subscription: Subscription;

  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'no',
    clearsessioncache : 'no',
    cleardata : 'no',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    hideurlbar:'yes',
    hidenavigationbuttons:'yes',
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    usewkwebview : 'yes',
    toolbarposition : 'top'//iOS only 
};

  constructor(private dataService:DataService,private router: Router,private nav: NavController,private iab: InAppBrowser,private ToastService:ToastService,private pickerController: PickerController,private LoadingService:LoadingService,private AlertMessageService:AlertMessageService,private StorageService:StorageService,private CartService:CartService,private AuthenticationService:AuthenticationService,private CheckoutService:CheckoutService,private ApiConnectionService:ApiConnectionService,private AddressService:AddressService) { }

  ngOnInit() 
    {

          this.subscription = this.AuthenticationService.isUserLoggedIn.subscribe(loggedIn => {
            if (loggedIn) {
              this.load_page_content();
            }else
            {
              this.AuthenticationService.getLoggedInStatus();
              if (this.AuthenticationService.userHasLogged)
              {
                this.load_page_content();
              }
            }
          });
      
    }
  ngOnDestroy()
    {
          this.subscription.unsubscribe();
    }
  async load_page_content()
    {
          await this.AuthenticationService.getLoggedInStatus();

          if (this.AuthenticationService.userHasLogged) {
            await this.CartService.getCart();
            await this.getCheckoutData();
          }
    }
  async ionViewWillEnter()
    {
          if (this.AddressService.newAddressAdded == true)
          {
            await this.CartService.getCart();
            await this.getCheckoutData();
            this.AddressService.newAddressAdded = false;
          }
    }
    
  async getCheckoutData()
    {  
      
          this.LoadingService.showLoading();
          let checkout_link='/mobile_app/v1/checkout';
          this.CheckoutService.getCheckoutData(checkout_link).then(data => {
          if (data !== undefined && data !='' && data != null){
            
            this.LoadingService.stopLoading();
            this.ApiConnectionService.getCookieStringVal(checkout_link);
            this.selected_address = data.selected_address;
            this.selected_courier =data.selected_courier;
            this.selected_delivery_day = data.selected_delivery_day;
            this.radioFocus(this.selected_address);
            }
            
          });
    }

  addAddress()
    {
          this.nav.navigateForward('/address')
    }

  async createPayment()
    {

          //   this.nav.navigateForward('/payment')

          this.CheckoutService.create_order_array.item_total = this.subTotal;
          this.CheckoutService.create_order_array.items = this.totalItems;
          this.CheckoutService.create_order_array.courier_total = this.courier_price;
          this.CheckoutService.create_order_array.courier_id = this.selected_courier;
          this.CheckoutService.create_order_array.delivery_id = this.selected_address;
          this.CheckoutService.create_order_array.discount_total = this.discount_total;
          this.CheckoutService.create_order_array.total = this.total_amount;
          this.LoadingService.showLoading();
          this.CheckoutService.createOrder().then(data => {
            //console.log ("Abi-cookie" + this.ApiConnectionService.cookie);
            this.LoadingService.stopLoading();
            this.cookieArray = this.ApiConnectionService.cookie.split(';')
            for (var i = 0; i< this.cookieArray.length; i++)
            {
              var session:string = this.cookieArray[i];
              if (session.includes('vscommerce'))
              {
                this.sessionCookie = this.cookieArray[i];

              }
            }
            this.sessionCookie = this.sessionCookie + ';';
            //console.log ("Abi-cookie2" + this.sessionCookie);
          if (data !== undefined && data !='' && data != null){
                if (data.success === true)
                {
                      this.openWithInAppBrowser( this.ApiConnectionService.client_url + '/mobile_app/page/payment' + ',' + this.sessionCookie);
                      // this.openWithCordovaBrowser('https://www.triads.co.uk/mobile_app/page/payment?api_token=eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9');
                }else if("failed" in data)
                {
                  this.ToastService.presentToastMsg("There was an error,please try again.");
                }else{
                  this.ToastService.presentToastMsg("There was an error,please try again.");
                }
            }
          });

    }

  public openWithCordovaBrowser(url : string)
    {

          let target = "_self";
          let browser = this.iab.create('',target,this.options);
          browser.on('loadstart').subscribe(() => {
            browser.executeScript({code: 'document.cookie'}).then((cookies) => {
              // do something with cookies
              //console.log ("Abi" + cookies);
            });
          });
    }  

  public openWithInAppBrowser(url : string)
    {
          //     let target = "_blank";
          //     this.iab.create(url,target,this.options);
            let target = "_blank";
            let browser = this.iab.create(url,target,this.options);
            browser.on('loadstop').subscribe((event) => {
              browser.executeScript({code: 'document.cookie'}).then((cookies) => {
              });
              
            });
            browser.on('loadstart').subscribe((event) => {
              //If reqd the below code can be put in loadstop function above
            if (event && event.url) {
              if (event.url.includes('/checkout/success')){
                this.StorageService.remove('CartItems');
                this.ToastService.presentToastMsg("Yay!Payment successful!");

                browser.on('exit').subscribe(event => this.dataService.tohomepage());
              }
              else if (event.url.includes('/paypal_express/cancel') || (event.url.includes('action') && event.url.includes('cancel'))){
                  browser.close();
                  this.ToastService.presentToastMsg("Payment cancelled!Something went wrong.");
              }
              else if(event.url.includes('mybag')){
                browser.close();
                this.ToastService.presentToastMsg("Payment cancelled!Something went wrong.."); 
              }
              else if(event.url.includes('basket')){
                browser.close();
                this.ToastService.presentToastMsg("User cancelled Payment from payment gateway."); 
              }else if(event.url.includes('external')){
                browser.close();
                this.ToastService.presentToastMsg("Payment cancelled!Something went wrong..."); 
              }else if(event.url.includes('message')){
                browser.close();
                this.ToastService.presentToastMsg("Payment cancelled!Something went wrong...."); 
              }
            }
            })
        
    }
    
  showTerms()
    {
          //this.openWithInAppBrowser('http://www.triads.co.uk/terms-conditions-i7');
          if(this.terms_condition_link!== undefined && this.terms_condition_link !="")
          {
            this.openWithInAppBrowser(this.terms_condition_link);
          }
      
    }

  radioGroupChange(event:any)
    {
          console.log ("addressChange");
    }

  radioGroupChangeCourier(event:any)
    {
          console.log ("courierChange");
    }

  radioFocus(event:string) 
    {
          this.LoadingService.showLoading();
          let addressUrl = '/mobile_app/v1/change_address/' + event + '/' + this.selected_courier + '/' + this.selected_delivery_day;
          this.ApiConnectionService.post({url:addressUrl}).then(data => {
            this.LoadingService.stopLoading();
            if (data !== undefined && data !='' && data != null){
            this.checkoutpagechange_data(data);
            }
          });
    }

  radioFocusCourier(event:string) 
    {
          this.LoadingService.showLoading();
          let courierUrl = '/mobile_app/v1/change_address/' + this.selected_address + '/' + event + '/' + this.selected_delivery_day;
          this.ApiConnectionService.post({url:courierUrl}).then(data => {
            this.LoadingService.stopLoading();
            if (data !== undefined && data !='' && data != null){
            this.checkoutpagechange_data(data);
            }
          });
    }
  changeDeliveryDay() 
    {
          this.LoadingService.showLoading();
          let courierUrl = '/mobile_app/v1/change_address/' + this.selected_address + '/' +  this.selected_courier + '/' + this.selected_delivery_day;
          this.ApiConnectionService.post({url:courierUrl}).then(data => {
            this.LoadingService.stopLoading();
            if (data !== undefined && data !='' && data != null){
            this.checkoutpagechange_data(data);
            }
          });
    }

  applyDiscount()
    {

          this.CheckoutService.discount_code = this.discountCode;
          this.CheckoutService.discount_action ='apply';
          if(this.discountCode == undefined ||  this.discountCode == "")
              {
                  this.discountapplyerrormsg='Please Enter a Code';
              }else
              {
                  this.LoadingService.showLoading();
                  this.CheckoutService.applyRemoveDiscount().then(data => {
                    this.LoadingService.stopLoading();
                    if (data !== undefined && data !='' && data != null){
                          if (data.success === true){
                            this.discountCode='';
                            this.ToastService.presentToastMsg("Discount Code Applied");
                            this.checkoutpagechange_data(data);
                          }
                          else{
                            this.discountapplyerrormsg = data.error_message;
                          }
                    }
                  });
              }
    }
  async removeDiscount(codekey:any)
    {

          this.CheckoutService.discount_code = '';
          this.CheckoutService.discount_code_key = codekey;
          this.CheckoutService.discount_action ='remove';

          const confirmreslt = await this.AlertMessageService.confirmationAlert(
            'Confirmation','Remove Discount Code?','Cancel','Remove'
          );
          
          if(!confirmreslt)
          {
            return;
          }else{

                  this.LoadingService.showLoading();
                  this.CheckoutService.applyRemoveDiscount().then(data => {
                    this.LoadingService.stopLoading();
                    if (data !== undefined && data !='' && data != null){
                          if (data.success === true){
                            this.ToastService.presentToastMsg("Discount Code Removed");
                            this.checkoutpagechange_data(data);
                          }
                          else{
                            this.discountapplyerrormsg = data.error_message;
                          }
                    }
                  });
            }
    }
  checkoutpagechange_data(resultdata:any)
    {
          this.CartService.basket_array = [];
          this.itemsArray = resultdata.products;
          this.failedproductArray=resultdata.failed_products;
          this.alteredproductArray=resultdata.altered_products;

          if(this.alteredproductArray != null && this.alteredproductArray.length>0)
          {
            for(let k:number =0; k<this.alteredproductArray.length;k++) { 
                    if(this.alteredproductArray[k].type == 'qty')
                        {
                          this.alteredqtyproductArray.push(this.alteredproductArray[k]);
                        }
                    if(this.alteredproductArray[k].type == 'price')
                        {
                          this.alteredpriceproductArray.push(this.alteredproductArray[k]);
                        }
                    if(this.alteredproductArray[k].type == 'both')
                        {
                          this.alteredqtypriceproductArray.push(this.alteredproductArray[k]);
                        }
            }
          }
          this.addressesArray = resultdata.addresses;
          this.couriersArray = resultdata.couriers;
          this.discountCodesArray = resultdata.discount_codes;
          this.totalItems = resultdata.items;
          this.subTotal = resultdata.sub_total;
          this.selected_address = resultdata.selected_address;
          this.selected_courier = resultdata.selected_courier;
          this.flash_message=resultdata.flash_message;
          this.selected_delivery_day = resultdata.selected_delivery_day;
          this.discount_total = resultdata.discount_total;
          this.terms_condition_link=resultdata.options.terms_link;
          this.option_settings=resultdata.options;
          this.option_settings_currency=resultdata.options.currency;
          this.delivery_date_day_title="Choose Delivery Day";
          this.delivery_day_array='';
          for(let k:number =0; k<this.couriersArray.length;k++) {  

            if(this.couriersArray[k].id == resultdata.selected_courier)
            {
              if(this.couriersArray[k].days != undefined && this.couriersArray[k].days !='' && this.couriersArray[k].days != null)
              {
                this.delivery_day_array = this.couriersArray[k].days;

                for (let key in this.delivery_day_array) {
                    if(this.selected_delivery_day == key)
                    {
                      this.delivery_date_day_title =this.delivery_day_array[key];
                    }
                  // Use `key` and `value`
                  }
              }
            }

          }

          for (let courier of this.couriersArray){
            if (courier.id === this.selected_courier)
            {
              this.courier_price = courier.price;
            }
          }
          if(this.discount_total =="")
          {
            this.discount_total="0";
          }
          var total = Number(this.subTotal) + Number(this.courier_price) - Number(this.discount_total);
          //this.total_amount = total.toString();
          this.total_amount = total.toFixed(2).toString();
          this.viewEntered=true;
      }
      async openDeliveryDatePicker(){
        let options = {
          buttons: [
            {
              text: "Cancel",
              role: 'cancel'
            },
            {
              text:'OK',
              handler:(value:any) => {
                var selectedIndex:any = Object.values (value);
                this.delivery_date_day_title = selectedIndex[0].text;
                this.selected_delivery_day=selectedIndex[0].value;
                this.changeDeliveryDay();
              }
            }
          ],
          columns:[{
            name:'DeliveryDates',
            options:this.getDeliveryDateOptions()
          }]
        };

        let picker = await this.pickerController.create(options);
        picker.present()
  }
  getDeliveryDateOptions()
    {
          let options = [];
          for (let key in this.delivery_day_array) {
            let date_value = this.delivery_day_array[key];
            options.push({text:date_value,value:key});
            // Use `key` and `value`
          }
          return options;
    }
  
  retry_page_content()
    {
          this.ApiConnectionService.networkConnectionCheck();
          this.load_page_content();
    }
}
