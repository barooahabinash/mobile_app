import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  itemsIncart:any = [];
  totalPrice:string = '';
  cartCount: Number;
  basket_array:any = [];

  constructor(private StorageService: StorageService) { }

  async getCartData()
    {
            this.itemsIncart = await this.StorageService.get('CartItems');
            if (this.itemsIncart !== null)
            {
              if (this.itemsIncart.length !== 0)
            {
            let sum = 0;
            let total= 0;
            let count = 0;
            for (let item of this.itemsIncart) {
              count = count + Number(item.quantity);
              total = Number(item.quantity);
                if (total > 1){        
                          var amount = +item.price;
                          amount = total * amount;
                          sum = sum + amount;
                        //  item.price = amount.toString();
                        }
                        else{
                          sum = sum + Number(item.price);
                        }
                  }
            this.totalPrice = String(sum.toFixed(2));
            this.cartCount = count;
            return this.itemsIncart;
            }
            else{
              this.cartCount = null;
            }
            }
            
            else{
              this.cartCount = null;
            }
    }

  changePriceBasedPriceBreaks(pr_br_count:any,pr_br_det:any,item_cnt:any,price_amt:any)
    {
            let index_heighest_val:Number=0;
            if(parseInt(pr_br_count)>1 && pr_br_det !='' && pr_br_det != null && pr_br_det != undefined)
            {

                  for (var index in pr_br_det) 
                    {
                        if (pr_br_det.hasOwnProperty(index)) 
                        {
                            if(parseInt(index) <= parseInt(item_cnt))
                            {
                                if(index_heighest_val <= parseInt(index))
                                {
                                  index_heighest_val=parseInt(index);
                                  if(pr_br_det[index].sale_price !== undefined)
                                      {
                                        price_amt = pr_br_det[index].sale_price;
                                      }
                                  else
                                      {
                                          price_amt = pr_br_det[index].price;
                                      }
                                }
                            } 
                        }
                    }
            
            }

            return price_amt;

    } 

  async getCart()
    {
          await this.getCartData().then(async data => {
                if (data !== undefined && data !='' && data != null){
                  this.itemsIncart = data;
                  for (var i = 0; i < (this.itemsIncart.length); i++){
                    var id:number = Number(this.itemsIncart[i].product_id);
                    var qty:number = Number(this.itemsIncart[i].quantity);
                    var price:number = Number(this.itemsIncart[i].price);
                    var extra_data = {
                      "id":id,
                      "qty":qty,
                      "price":price
                        };
                        this.basket_array.push(extra_data);

                  }
                }

              });
    }


}
