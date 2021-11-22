import { Injectable } from '@angular/core';
import { NavController} from '@ionic/angular';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  current_product:string = '';
  current_product_id:string = '';
  product_list_header:string='';
  product_attribute_tree:any='';
  actualPrice:string = '';
  salePrice:string = '';
 
  dataArray:any = [];
  sync_products: any = [];

  globalSearch:any;
  tab_menu_path:any;
   
  morePageLink:string = '';
  morePageLinkDisplayName:string = '';
 
  address_lookup:boolean = false;
  barcode_scan:boolean =false
  basket_reminder:any=[];
  menu_submenu_clicked_data:any=[];

  push_key:string = '';
 
  constructor(private nav: NavController) {}

  extractHostname(url:any)
    {

            var hostname:any;
          //find & remove protocol (http, ftp, etc.) and get hostname

          if (url.indexOf("//") > -1) {
              hostname = url.split('/')[2];
          }
          else {
              hostname = url.split('/')[0];
          }
        
          //find & remove port number
          hostname = hostname.split(':')[0];
          //find & remove "?"
          hostname = hostname.split('?')[0];
          //find & remove "www." 
          hostname = hostname.replace("www.", "");

          hostname = hostname.split('.')[0];
          return hostname;
    }
      
  objectLength(obj:any) 
    {
          let result:number = 0;
          for(var prop in obj) {
              if (obj.hasOwnProperty(prop)) {
              // or Object.prototype.hasOwnProperty.call(obj, prop)
              result++;
              }
          }
            return result;
    } 
    
  getCorrectIndexPriceBreaksWishlist(pr_br_det:any,item_cnt:any)
    {
          let index_heighest_val:Number=1;
          if(pr_br_det !='' && pr_br_det != null && pr_br_det != undefined)
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
                                
                                }
                            } 
                        }
                    }
            
            }

          return index_heighest_val;

    } 
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
        return 0;
    }
    
  tohomepage()
    {
          this.tab_menu_path='/tabs/home';
          this.nav.navigateForward(this.tab_menu_path+'/shop');
    }
  tomainmenupage()
    {
          this.tab_menu_path='/tabs/menu';
          this.nav.navigateForward(this.tab_menu_path+'/mainmenu');
    }
  towishlistpage()
    {
          this.tab_menu_path='/tabs/wishlist';
          this.nav.navigateForward(this.tab_menu_path+'/wish-list');
    }
  tomorepage()
    {
          this.tab_menu_path='/tabs/morelist';
          this.nav.navigateForward(this.tab_menu_path+'/more');
    }
  getRandomInt(min:number , max:number) : number
    {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min; 
    }
  sleep(ms:any) 
    {
          return new Promise(resolve => setTimeout(resolve, ms));
    }

}
 

//Product-list data
export interface ProductList {
  brand: string,
  display_name: string,
  image: string,
  link: string,
  price: string,
  sale_price: string,
  sku: string
}

export interface WishList {
  attribute_tree: [],
  image: string,
  link: string,
  price: [],
  product_id: string,
  quantity: string,
  summary: string,
  title: string
}
//Product data, to be used later if reqd
export interface Product {
  title: string,
  total_stock: string,
  image: string,
  price: string,
  sale_price: string,
  size: string,
  color: string
}