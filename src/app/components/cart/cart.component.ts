import { DataService } from './../../api/data.service';
import { Component, OnInit,NgZone } from '@angular/core';
import { NavController,MenuController} from '@ionic/angular';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastService } from 'src/app/services/toast/toast.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

 itemsIncart:any = [];
 cartArray: any = [];

  constructor(private ngZone: NgZone,private dataService:DataService,private nav: NavController,private menu: MenuController,private AlertMessageService:AlertMessageService,private StorageService:StorageService,private CartService:CartService,private ToastService:ToastService) { }

  ngOnInit()
    {


    }

  open()
    {
          this.menu.close();
          this.nav.navigateForward('/checkout');
    }
  closeCart()
    {
          this.menu.close();
    }
  segmentChanged(event:any)
    {

    //Keeping this function in case it is required later

    // if (event.detail.value === 'Add'){
    // }
    }

  async getCart()
    {

          await this.CartService.getCartData().then(async data => {
                if (data !== undefined){
                  this.itemsIncart = data;
                  for (var i = 0; i < (this.itemsIncart.length); i++){
                    this.cartArray.push(this.itemsIncart[i]);
                  }
                }
              });
    }

  async addSelected(data:any)
    {

      
          await this.getCart();

          if (this.cartArray !== null || this.cartArray !== undefined){
              for (var k = 0; k < (this.cartArray.length); k++){
              //if (this.cartArray[k].title === data.title){
                //if (this.cartArray[k].color === data.color){
                  //if (this.cartArray[k].size === data.size){
                  if(this.cartArray[k].product_id === data.product_id)
                    {
                    if(parseInt(this.cartArray[k].quantity) < parseInt(data.stock))
                    {
                      var num = +this.cartArray[k].quantity;
                      num = num + 1;
                      this.cartArray[k].quantity = num.toString();
                      this.cartArray[k].price=this.CartService.changePriceBasedPriceBreaks(this.cartArray[k].price_breaks_count,this.cartArray[k].price_breaks_details,this.cartArray[k].quantity,this.cartArray[k].price)
                    }else
                    {
                      this.cartArray = [];
                      this.ToastService.presentToastMsg("Only "+data.stock+" in stock")
                      return;
                    }
                  }
                  // }

                // }
              //}
            }
            this.StorageService.set('CartItems',this.cartArray);
            await this.CartService.getCartData().then(async data => {
            });
            this.cartArray = [];
          }
    }

    
  async removeSelected(data:any)
    {

          await this.getCart();


            if (this.cartArray !== null || this.cartArray !== undefined){
              for (var i = 0; i < (this.cartArray.length); i++){
                if(this.cartArray[i].product_id === data.product_id)
                  {
                          if(parseInt(this.cartArray[i].quantity)==1)
                          {
                          
                            //var confirmstatus=await this.presentConfirm();
                            const confirmreslt = await this.AlertMessageService.confirmationAlert(
                              'Confirmation','Remove from Basket?','Cancel','Remove'
                            );
                            
                            if(!confirmreslt)
                            {
                              this.cartArray = [];
                              return;
                            }
                          }

                          var num = +this.cartArray[i].quantity;
                        
                          num = num - 1;
                          if (num === 0)
                          {
                            this.cartArray.splice(i,1);
                          }
                          else
                          {
                            this.cartArray[i].quantity = num.toString();
                            this.cartArray[i].price=this.CartService.changePriceBasedPriceBreaks(this.cartArray[i].price_breaks_count,this.cartArray[i].price_breaks_details,this.cartArray[i].quantity,this.cartArray[i].price)

                          }

                        
                  }
            }
            this.StorageService.set('CartItems',this.cartArray);
            await this.CartService.getCartData().then(async data => {
            });
            this.cartArray = [];
          }
    }
  async deleteItem(data:any)
    {

          await this.getCart();


            if (this.cartArray !== null || this.cartArray !== undefined){
              for (var i = 0; i < (this.cartArray.length); i++){
                    if(this.cartArray[i].product_id === data.product_id)
                  {
                          
                            const confirmreslt = await this.AlertMessageService.confirmationAlert(
                              'Confirmation','Remove from Basket?','Cancel','Remove'
                            );
                            
                            if(!confirmreslt)
                            {
                              this.cartArray = [];
                              return;
                            }
                          
                          if(confirmreslt)
                          {
                          this.cartArray.splice(i,1);
                          }

                        
                  }
            }
            this.StorageService.set('CartItems',this.cartArray);
            await this.CartService.getCartData().then(async data => {
            });
            this.cartArray = [];
          }
    }

  open_product_detail(data:any)
    {
          let menu_id_name:any='';
          let current_product_id:any='';
          this.menu.get().then(responseval => {
              menu_id_name=responseval.menuId;
              current_product_id = menu_id_name.split("#***#");
              if((menu_id_name.indexOf('product-detail') !== -1) && (current_product_id[1] == data.p_product_id))// Clicking on the same basket item which is in product detail while opening basket from product detail should simply collapse the basket
              {
                  this.menu.close();
              }else
              {   
                  this.menu.close();
                  let randno:number =this.dataService.getRandomInt(30001,40000);
                  this.nav.navigateForward( this.dataService.tab_menu_path+'/product-detail/'+randno);
                  this.dataService.current_product_id = data.p_product_id;		 
              }
            });

    }

  
}