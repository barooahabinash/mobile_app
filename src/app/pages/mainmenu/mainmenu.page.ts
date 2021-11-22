import { Component, OnInit } from '@angular/core';
import { DataService } from './../../api/data.service';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.page.html',
  styleUrls: ['./mainmenu.page.scss'],
})
export class MainmenuPage implements OnInit {
  menuDetails: string[] = [];
  availableBrands: string[] = [];
  isBrandsAvailable:boolean;
  isBrandsClicked:boolean;
  menu_heading:string='';
  viewEntered:boolean;
  constructor(private dataService:DataService,private nav: NavController,private menu: MenuController,private LoadingService:LoadingService,private CartService:CartService,private ApiConnectionService:ApiConnectionService) { }

  ngOnInit() 
    {
          this.viewEntered=false;
          this.load_page_content();
    }
  ionViewWillEnter()
    {
    
    }
  load_page_content()
    {
          this.menuDetails= [];
          this.availableBrands= [];
          this.getMenu();
    }
  async getMenu()
    {
          this.menu_heading=this.ApiConnectionService.client_app_name.toUpperCase();
          this.isBrandsClicked = false; 
          await this.ApiConnectionService.getDeviceInfo(); 
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:'/mobile_app/v1/menu'}).then(data => {
          this.LoadingService.stopLoading(); 
          if (data !== undefined){
            for (var i = 0; i < (data.departments.length); i++)
            {
              this.menuDetails.push(data.departments[i]);
            }
            this.availableBrands = data.brands;
            }
            this.viewEntered=true;
          });
    }

  navigateFromMenu(menudet:any)
    {
            //Now the navigation is set to product list, will have to work on the sub menus
            if (menudet.link !== null){
              var link :string =menudet.link;
              this.dataService.current_product = menudet.link;
              this.dataService.product_list_header = menudet.display_name;
              if (link.includes('c_'))
                {
                  this.dataService.menu_submenu_clicked_data=[];
                  this.dataService.menu_submenu_clicked_data.push(menudet);
                  this.nav.navigateForward(this.dataService.tab_menu_path+'/submenuone');
                }else{
                  let randno:number =this.dataService.getRandomInt(20001,30000); 
                  this.nav.navigateForward(this.dataService.tab_menu_path+'/products-list/'+randno);
                }
              
              
            }else
            {
              this.dataService.product_list_header ='';
            }
    }
  openCustom() 
    {
          this.menu.enable(true, 'mainmenu');
          this.menu.open('mainmenu');
          //The below code should no longer be reqd,need to check it later
          this.CartService.getCartData().then(async data => {
              if (data !== undefined){
              //  this.itemsIncart = 
              }
            });
    }
  brandsclicked()
    {
          this.isBrandsClicked = true;
    }
    
  departmentsClicked()
    {
          this.isBrandsClicked = false;
    }

  retry_page_content()
    {
          this.viewEntered=false;
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
