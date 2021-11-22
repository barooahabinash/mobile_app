import { Component, OnInit } from '@angular/core';
import { DataService,WishList } from './../../api/data.service';
import { NavController,MenuController} from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.page.html',
  styleUrls: ['./wish-list.page.scss'],
})
export class WishListPage implements OnInit {

  recieved_data: Array<WishList> = [];
  options_settings:any=[];
  price_break_corrct_index:any=[];
  wishlistImage:boolean =false;
  viewEntered:boolean;

  subscription: Subscription;

  constructor(private dataService:DataService,private nav: NavController,private menu: MenuController,private ToastService:ToastService,private LoadingService:LoadingService,private AlertMessageService:AlertMessageService,private StorageService:StorageService,private CartService:CartService,private AuthenticationService:AuthenticationService,private ApiConnectionService:ApiConnectionService) { 
    
  }

  ngOnInit() 
    {

          this.subscription =this.AuthenticationService.isUserLoggedIn.subscribe( checkout_page_login_status => {
            if(checkout_page_login_status == true)
            {
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
          this.subscription.unsubscribe()  
    }
  ionViewWillEnter()
    {
          this.load_page_content();
    }
  load_page_content()
    {
          this.recieved_data =[];
          this.price_break_corrct_index=[];
          this.wishlistImage=false;
          this.viewEntered=false;
          this.AuthenticationService.getLoggedInStatus();
          if (this.AuthenticationService.userHasLogged)
          {
            this.getWishlist();
          }
    }

  getWishlist()
    {
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:'/mobile_app/v1/wish_list',postParams:{sync_products: JSON.stringify(this.dataService.sync_products)}}).then(data => {
              if (data !== undefined && data !='' && data != null){
                this.options_settings=data.options;
                this.recieved_data = [];
                this.price_break_corrct_index=[];
                for (var i = 0; i < (data.wish_list.length); i++)
                  {
                  this.price_break_corrct_index.push(this.dataService.getCorrectIndexPriceBreaksWishlist(data.wish_list[i].price_breaks,data.wish_list[i].quantity));
                  this.recieved_data.push(data.wish_list[i]);
                  } 
                }
                this.viewEntered=true;
                this.LoadingService.stopLoading();
          });
    }
    
  open(data:any)
    {
          let randno:number =this.dataService.getRandomInt(50001,60000); 
          this.nav.navigateForward( this.dataService.tab_menu_path+'/product-detail/'+randno);
          this.dataService.current_product_id = data.link;
    }

  openMenu() 
    {
          this.menu.enable(true, 'third');
          this.menu.open('third');
    }

  openCustom() 
    {
          this.menu.enable(true, 'wishlist');
          this.menu.open('wishlist');
    }

  async addSelected(data:any)
    {

          var product_id:number = Number(data.product_id);
          //uncomment below to get the current quantity of product
          //  var quantity:number = Number(data.quantity);
          var quantity:number = 1;

                      var extra = {
                        "product_id":product_id,
                        "quantity":quantity
                      };
                      
                      this.dataService.sync_products.push(extra);
                      this.LoadingService.showLoading();
                      this.ApiConnectionService.post({url:'/mobile_app/v1/wish_list',postParams:{sync_products: JSON.stringify(this.dataService.sync_products)}}).then(data => {
                      this.LoadingService.stopLoading(); 
                          if (data !== undefined && data !='' && data != null){

                              this.recieved_data = [];
                              this.price_break_corrct_index=[];
                              for (var i = 0; i < (data.wish_list.length); i++)
                                {

                                    this.price_break_corrct_index.push(this.dataService.getCorrectIndexPriceBreaksWishlist(data.wish_list[i].price_breaks,data.wish_list[i].quantity));
                                  this.recieved_data.push(data.wish_list[i]);
                                } 
                              }  
                            this.dataService.sync_products = [];
                      });

  }

  async removeSelected(data:any)
    {
          if(parseInt(data.quantity)==1)
          {
          
                const confirmreslt = await this.AlertMessageService.confirmationAlert(
                  'Confirmation','Remove from Wish List?','Cancel','Remove'
                );
                
                if(!confirmreslt)
                {
                  return;
                }
          }
          var product_id:number = Number(data.product_id);
          //uncomment below to get the current quantity of product
          //  var quantity:number = Number(data.quantity);
                      var quantity:number = -1;
                      if (quantity === 0)
                      {
                        quantity = -1;
                      }

                      var extra = {
                        "product_id":product_id,
                        "quantity":quantity
                      };
                      
                      this.dataService.sync_products.push(extra);
                    
                      this.LoadingService.showLoading();
                      this.ApiConnectionService.post({url:'/mobile_app/v1/wish_list',postParams:{sync_products: JSON.stringify(this.dataService.sync_products)}}).then(data => {
                      this.LoadingService.stopLoading();  
                          if (data !== undefined && data !='' && data != null){

                            this.recieved_data = [];
                            this.price_break_corrct_index=[];

                            for (var i = 0; i < (data.wish_list.length); i++)
                              {
                                this.price_break_corrct_index.push(this.dataService.getCorrectIndexPriceBreaksWishlist(data.wish_list[i].price_breaks,data.wish_list[i].quantity));
                                this.recieved_data.push(data.wish_list[i]);
                              }  
                            } 
                          this.dataService.sync_products = [];
                      });

            

    }
  async deleteItem(data:any)
    {
          const confirmreslt = await this.AlertMessageService.confirmationAlert(
            'Confirmation','Remove from Wish List?','Cancel','Remove'
          );
          
          if(!confirmreslt)
          {
            return;
          }

          if(confirmreslt)
          {
            var product_id:number = Number(data.product_id);
            //uncomment below to get the current quantity of product
            //  var quantity:number = Number(data.quantity);
                        var quantity:number = -1;
                        if (parseInt(data.quantity) > 1)
                        {
                          quantity = -(parseInt(data.quantity));
                        }

                        var extra = {
                          "product_id":product_id,
                          "quantity":quantity
                        };
                      
                        this.dataService.sync_products.push(extra);
                        this.LoadingService.showLoading(); 
                        this.ApiConnectionService.post({url:'/mobile_app/v1/wish_list',postParams:{sync_products: JSON.stringify(this.dataService.sync_products)}}).then(data => {
                        this.LoadingService.stopLoading();  
                            if (data !== undefined && data !='' && data != null){

                              this.recieved_data = [];
                              this.price_break_corrct_index=[];

                              for (var i = 0; i < (data.wish_list.length); i++)
                                {
                                  this.price_break_corrct_index.push(this.dataService.getCorrectIndexPriceBreaksWishlist(data.wish_list[i].price_breaks,data.wish_list[i].quantity));
                                  this.recieved_data.push(data.wish_list[i]);
                                }  
                              } 
                            this.dataService.sync_products = [];
                        });
            }
        

    }
    segmentChanged(event:any){

      //Keeping this function in case it is required later
      // console.log('Segment changed', event.detail.value);
      // console.log('ItemsIncart', this.dataService.itemsIncart);
    
      // if (event.detail.value === 'Add'){
      // }
    }

  retry_page_content()
    {
          this.ApiConnectionService.networkConnectionCheck();
          this.load_page_content();
    }
  doRefresh(event) 
    {
          this.retry_page_content();

          setTimeout(() => {
            event.target.complete();
          }, 1000);
    }
}
