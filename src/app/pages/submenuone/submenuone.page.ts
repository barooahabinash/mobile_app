import { Component, OnInit } from '@angular/core';
import { DataService } from './../../api/data.service';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Component({
  selector: 'app-submenuone',
  templateUrl: './submenuone.page.html',
  styleUrls: ['./submenuone.page.scss'],
})
export class SubmenuonePage implements OnInit {

  submenu_id:any="";
  submenu_data:any=[];
  constructor(private dataService:DataService,private nav: NavController,private LoadingService:LoadingService,private ApiConnectionService:ApiConnectionService) { }

  ngOnInit() 
    {
          this.load_page_content();
    }
  load_page_content()
    {
          this.getMenu();
    }
  getMenu()
    {  
          this.submenu_id=this.dataService.menu_submenu_clicked_data[this.dataService.menu_submenu_clicked_data.length -1].id
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:'/mobile_app/v1/menu/'+this.submenu_id}).then(data => {
          this.LoadingService.stopLoading();
              if (data !== undefined && data !='' && data != null){

                this.submenu_data=data.departments;
              }
    
          });
    }

  navigateFromSubMenuOne(menudet:any)
    {
          //Now the navigation is set to product list, will have to work on the sub menus
          if (menudet.link !== null){
            var link :string =menudet.link;
            this.dataService.current_product = menudet.link;
            if(menudet.segue_name !== undefined && menudet.segue_name!="")
            {
              this.dataService.product_list_header = menudet.segue_name;
            }else{
            this.dataService.product_list_header = menudet.display_name;
            }
            if (link.includes('c_'))
              {
                this.dataService.menu_submenu_clicked_data.push(menudet);
                this.getMenu();
              }else{
                let randno:number =this.dataService.getRandomInt(30001,40000); 
                this.nav.navigateForward( this.dataService.tab_menu_path+'/products-list/'+randno);
              }
          
          
          }else
          {
            this.dataService.product_list_header ='';
          }
    }

  movetoPreviousSubMenu()
    {
          this.dataService.menu_submenu_clicked_data.splice(-1,1);
        
          var menudet=this.dataService.menu_submenu_clicked_data[this.dataService.menu_submenu_clicked_data.length -1];
          var link :string =menudet.link;
          this.dataService.current_product = menudet.link;
          if(menudet.segue_name !== undefined && menudet.segue_name!="")
          {
            this.dataService.product_list_header = menudet.segue_name;
          }else{
            this.dataService.product_list_header = menudet.display_name;
          }
          this.getMenu();
    }

  retry_page_content()
    {
          this.ApiConnectionService.networkConnectionCheck();
          this.load_page_content();
    }

}
