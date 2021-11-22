import { TabsPage } from './../tabs/tabs.page';
import { DataService } from './../../api/data.service';
import { Component, OnInit } from '@angular/core';
import { NavController,MenuController } from '@ionic/angular';
import { Plugins,PushNotification,PushNotificationToken,PushNotificationActionPerformed,AppState} from '@capacitor/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

const { LocalNotifications } = Plugins;
const { PushNotifications } = Plugins;
const { App } = Plugins;




@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})

export class ShopPage implements OnInit {

  fullWidthPromo:any = [];
  pairPromo:any = []; 
  widget_array:any =[];
  cartCount: Number;
  basketReminderMsg: string;
  basketReminderTime: Number;
  mainPromoImage:boolean =false;
  pairPromoImage:boolean =false;
  productImage:boolean =false;
  isAppActive:boolean =true;
  searchValue:any='';

 // slideOptsOne: any;

  promoDetails:any = {image:'',link:''};

  // //use the below to autoplay the slides,commented now
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true,
    speed:400
   };

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


  constructor(private dataService:DataService,private nav: NavController, private tabsPage:TabsPage,private menu: MenuController,private iab: InAppBrowser,private LoadingService:LoadingService,private CartService:CartService,private AuthenticationService:AuthenticationService,private ApiConnectionService:ApiConnectionService) { }

  ngOnInit() 
    {
          this.load_page_content();
    }
  load_page_content()
    {
          this.ApiConnectionService.networkConnectionCheck();
          this.initializeApp();
    }

  async initializeApp()
    {
          //Plugins.LocalNotifications.requestPermission();
          await this.ApiConnectionService.getDeviceInfo();
          App.addListener('appStateChange', (state: AppState) => {
            // state.isActive contains the active state
            this.isAppActive = state.isActive;
            if (this.isAppActive == false)
            {
              PushNotifications.removeAllDeliveredNotifications();
            }
          });
          if (require('../../../builder/builder.config.json').config === 'prod') {
            await this.registerForNotifications();
          }
          this.AuthenticationService.getLoggedInStatus();
          this.getHomePageData();
    }

  async registerDevice()
    {
      
          this.ApiConnectionService.post({url:'/mobile_app/v1/register_device',postParams: {push_key: this.dataService.push_key}}).then(data => {
            
            });
    }

  async registerForNotifications()
    {

          // Request permission to use push notifications
          // iOS will prompt user and return if they granted permission or not
          // Android will just grant without prompting
          PushNotifications.requestPermission().then(result => {
            if (result.granted) {
              // Register with Apple / Google to receive push via APNS/FCM
              PushNotifications.register();
            } else {
              // Show some error
            }
          });

          PushNotifications.addListener(
            'registration',
            (token: PushNotificationToken) => {
              this.dataService.push_key = token.value;
              this.registerDevice();
            },
          );

          PushNotifications.addListener('registrationError', (error: any) => {
            this.dataService.push_key = '';
            //alert('Error on registration: ' + JSON.stringify(error));
          });

          PushNotifications.addListener(
            'pushNotificationReceived',
            (notification: PushNotification) => {
              if (this.isAppActive){
                alert(notification.body);
              }
            },
          );

          PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification: PushNotificationActionPerformed) => {
            //alert('Push action performed: ' + JSON.stringify(notification));
            },
          );
    }

  getHomePageData()
    {  
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:'/mobile_app/v1/home'}).then(data => {
            this.LoadingService.stopLoading();
          if (data !== undefined && data !='' && data != null){
            
            this.dataService.address_lookup=data.options.address_lookup;
            this.dataService.barcode_scan=data.options.barcode_scan;
            this.dataService.basket_reminder=data.options.basket_reminder;

            for (var i = 0; i < (data.widgets.length); i++)
            {
              switch (data.widgets[i].type){
                case 'full_width_promo':
                    data.widgets[i].image_modified_details={'height':0,'width':0};
                    data.widgets[i].image_modified_details.width=window.innerWidth;
                    data.widgets[i].image_modified_details.height=Math.round(window.innerWidth/data.widgets[i].aspect_ratio);
                    data.widgets[i].image_modified_details={'height': data.widgets[i].image_modified_details.height,'width':data.widgets[i].image_modified_details.width};
                    data.widgets[i].slide_options={'initialSlide':0,'slidesPerView':1,'autoplay':true,'speed':data.widgets[i].image_duration};
                    break;
                case 'pair_promo':
                    data.widgets[i].image_modified_details={'height':0,'width':0};
                    data.widgets[i].image_modified_details.width=window.innerWidth;
                    data.widgets[i].image_modified_details.height=Math.round(window.innerWidth/data.widgets[i].aspect_ratio);
                    data.widgets[i].image_modified_details={'height':Math.round(data.widgets[i].image_modified_details.height/2),'width':Math.round(data.widgets[i].image_modified_details.width)};
                    break;
                  case 'product_slider':
                    data.widgets[i].options.image_modified_details={'height':0,'width':0};
                    data.widgets[i].options.image_modified_details.width=data.widgets[i].options.image_width;
                    data.widgets[i].options.image_modified_details.height=data.widgets[i].options.image_height+130;
                    data.widgets[i].options.image_modified_details={'height':data.widgets[i].options.image_modified_details.height,'width':data.widgets[i].options.image_modified_details.width};
                    
                  break;
              } 


            }

            this.widget_array=data.widgets;
            if (this.dataService.basket_reminder !== false)
            {
              this.basketReminderMsg = this.dataService.basket_reminder.message;
              this.basketReminderTime =Number(this.dataService.basket_reminder.time);

              this.notifyUser();
            }
          }

          });
    }

  async notifyUser()
    {

          const notifs = await LocalNotifications.schedule({
            notifications: [
              {
                title: this.ApiConnectionService.client_app_name.toUpperCase(),
                body: this.basketReminderMsg,
                id: 1,
                schedule: { at: new Date(Date.now() + 1000 * Number(this.basketReminderTime))},
                sound: 'file://sound.mp3',
                attachments: null,
                actionTypeId: "",
                extra: null,
              }
            ]
          });
    }
  homepagePromo(hmpgProm:any)
    {
          if (hmpgProm.link !== null){
                if (hmpgProm.link !== '')
                {
                    var link :string = hmpgProm.link;
                    if(link.includes('cms'))
                    {
                      this.dataService.morePageLink = hmpgProm.link;
                      this.dataService.morePageLinkDisplayName = hmpgProm.display_name;
                      this.nav.navigateForward(this.dataService.tab_menu_path+'/links');
                    }else if(link.includes('popup_')){
                      let popup_title_link:any = JSON.parse(link.replace("popup_","")); 
                      this.openWithInAppBrowser(popup_title_link.link);
                    }
                    else{
                      
                      this.dataService.product_list_header = hmpgProm.display_name;
                      if (link.includes('p'))
                      {
                        this.dataService.current_product_id = hmpgProm.link;
                        let randno:number =this.dataService.getRandomInt(40001,50000); 
                        this.nav.navigateForward(this.dataService.tab_menu_path+'/product-detail/'+randno+'');
                      }else if(link.includes('l')){
                        this.dataService.current_product = hmpgProm.link;
                        let randno:number =this.dataService.getRandomInt(40001,50000); 
                          this.nav.navigateForward(this.dataService.tab_menu_path+'/products-list/'+randno);
                      }
                    }
                }
          }else
          {
            this.dataService.product_list_header ='';
          }
    }
  openMenu() 
    {
          this.menu.enable(true, 'first');
          this.menu.open('first');
    }
  openCart() 
    {
          this.menu.enable(true, 'custom');
          this.menu.open('custom');
    }
  doRefresh(event)
    {
          this.getHomePageData();

          setTimeout(() => {
            event.target.complete();
          }, 1000);
    }
  retry_page_content()
    {
          this.ApiConnectionService.networkConnectionCheck();
          this.load_page_content();
    }
  toSearchPage()
    {
          if(this.searchValue.trim() !='' && this.searchValue != undefined && this.searchValue != null)
          {
            this.dataService.globalSearch=this.searchValue;  
            this.searchValue='';
            let randno:number =this.dataService.getRandomInt(30001,40000); 
            this.nav.navigateForward( this.dataService.tab_menu_path+'/search/'+randno);
          }else{
            this.searchValue='';
            this.dataService.globalSearch='';
          }
    }
  public openWithInAppBrowser(url : string)
    {
          let target = "_blank";
          this.iab.create(url,target,this.options);
    }
}