import { Injectable } from '@angular/core';
import { Order } from 'src/app/interfaces/order.interface';
import { CartService } from '../cart/cart.service';
import { ApiConnectionService } from '../api-connection/api-connection.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {


  discount_code:string = '';
  discount_action:string = '';
  discount_code_key:any='';

  create_order_array: Order = {
    item_total:'',
    items:'',
    courier_total:'',
    courier_id:'',
    delivery_id:'',
    discount_total:'',
    total:''
  }

  constructor(private ApiConnectionService:ApiConnectionService,private CartService:CartService) { }


  /**
     * 
     * @returns 
     */
  async getCheckoutData(linkVal:string) 
    {
          const checkout_fields = {
            basket: JSON.stringify(this.CartService.basket_array)
          };

          return this.ApiConnectionService.post({
            url: ''+linkVal,
            postParams: checkout_fields
          });

    }

    /**
     * 
     * @returns 
     */
  async createOrder() 
    {
          const create_order_fields = { 
            order: JSON.stringify(this.create_order_array)
          };

          return this.ApiConnectionService.post({
            url: '/mobile_app/v1/create_order',
            postParams: create_order_fields
          })
    }

    /**
     * 
     * @returns 
     */
  async applyRemoveDiscount() 
    {
            var discount_fields = {
              action:this.discount_action,
              code : this.discount_code,
              code_key : this.discount_code_key,
            }

            return this.ApiConnectionService.post({
              url: '/mobile_app/v1/discount_code',
              postParams: discount_fields
            });
    }


}
