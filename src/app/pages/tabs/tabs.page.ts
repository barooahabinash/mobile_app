import { Component, OnInit } from '@angular/core';
import { DataService } from './../../api/data.service';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  itemsIncart:any = [];
 // cartCount: Number;

  constructor(private dataService:DataService,private nav: NavController,private CartService:CartService) { }

  ngOnInit() 
    {
          this.dataService.tab_menu_path='/tabs/home';
    }
  ionViewWillEnter()
    {

          //Had to get the cart data here because ionViewWillEnter doesn't get called on a page with tabs, it will help to set cart value in other tab pages as well
          this.CartService.getCartData().then(async data => {
            });
    }
    /* click home, mainmenu,wishlist and more functions are for make tab section common for all the pages */
  click_home_tab()
    {
          this.dataService.tohomepage();
    }
  click_mainmenu_tab()
    {
          this.dataService.tomainmenupage()
    }
  click_wishlist_tab()
    {
          this.dataService.towishlistpage();
    }
  click_more_tab()
    {
          this.dataService.tomorepage();
    }
}
