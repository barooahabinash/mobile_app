import { Component, OnInit } from '@angular/core';
import { DataService } from './../../api/data.service';
import { NavController } from '@ionic/angular';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  menuDetails: string[] = [];
  availableBrands: string[] = [];
  isBrandsAvailable:boolean;
  isBrandsClicked:boolean;

  constructor(private dataService:DataService,private nav: NavController,private ApiConnectionService:ApiConnectionService) { }

  ngOnInit() {
    
   this.getMenu();

  }

   async getMenu(){ 
    await this.ApiConnectionService.getDeviceInfo(); 
    this.ApiConnectionService.post({url:'/mobile_app/v1/menu'}).then(data => {
     console.log ("Menu data");
    console.log (data);
    if (data !== undefined){
      for (var i = 0; i < (data.departments.length); i++)
      {
        this.menuDetails.push(data.departments[i]);
  
      }
      this.availableBrands = data.brands;

    //  console.log ("available brands" + this.availableBrands);
     }
   });
  }

  brandsclicked(){

  this.isBrandsClicked = true;
  }

  departmentsClicked(){

    this.isBrandsClicked = false;
  }
  navigateFromMenu(menudet:any){
    //Now the navigation is set to product list, will have to work on the sub menus
    if (menudet.link !== null){
      var link :string =menudet.link;
      this.dataService.current_product = menudet.link;
      this.dataService.product_list_header = menudet.display_name;
      if (link.includes('c_'))
        {
          this.dataService.menu_submenu_clicked_data=[];
          this.dataService.menu_submenu_clicked_data.push(menudet);
          this.nav.navigateForward('/submenuone');
        }else{
          let randno:number =this.dataService.getRandomInt(10001,20000); 
          this.nav.navigateForward( this.dataService.tab_menu_path+'/products-list/'+randno);
        }
     
     
    }else
    {
      this.dataService.product_list_header ='';
    }
  }
}
