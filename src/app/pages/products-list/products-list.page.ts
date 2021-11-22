import { Component, OnInit } from '@angular/core';
import { DataService, ProductList } from './../../api/data.service';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';
import { FiltersService } from 'src/app/services/filters/filters.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.page.html',
  styleUrls: ['./products-list.page.scss'],
})
export class ProductsListPage implements OnInit {
//whatever initialize here check and initialize in createPopover function section
 //All response fields are in recieved_data array, any other field can be added for display from here when required
 recieved_data: Array<ProductList> = [];
 append_item = 0;
 more_status:boolean=false;
 searchValue:any='';
 itemsIncart:any = [];
// cartCount: Number;
 filters_data:any = [];
 option_settings:any =[];
 option_settings_currency:any=[];
 productListImage:boolean =false;
 viewEntered:boolean;
 image_modified_details:any ={'width':0,'height':0}

 subscription?: Subscription;

  //whatever initialize here check and initialize in createPopover function section
  constructor(
    private dataService:DataService,
    private nav: NavController,
    private menu: MenuController,
    private LoadingService:LoadingService,
    private CartService:CartService,
    private FiltersService:FiltersService,
    private ApiConnectionService:ApiConnectionService
  ) {}

  ngOnInit() 
    {
          this.FiltersService.product_filter_flag=false;
          this.FiltersService.filterData =[];
          this.viewEntered=false;
          this.FiltersService.filter_page_display_data =[];
          this.getProducts(false, "");

          this.subscription = this.FiltersService.isFilterApplied.subscribe( filtersApplied => {
            if(filtersApplied == true) {
              this.FiltersService.product_filter_flag=true;  
              this.load_page_content();
            }

          });
    }

  ngOnDestroy() 
    {
          this.subscription.unsubscribe();
    }

  ionViewWillEnter()
    {
    }
    
  getProducts(isFirstLoad: boolean, event:any) 
    {
      
          let product_url  = '/mobile_app/v1/products/' + this.dataService.current_product;
          if (isFirstLoad)
            product_url = product_url + '?start='+ this.append_item + '&key=' + Math.random();
          else
            this.LoadingService.showLoading();

                      this.ApiConnectionService.post({url: product_url, postParams: {filters:JSON.stringify(this.FiltersService.filterData)}}).then(data => {
                                  if(this.append_item == 0)
                                    {
                                      
                                    }
                                  if (data !== undefined && data !='' && data != null){

                                          if(this.append_item == 0)
                                          {
                                            
                                            this.option_settings=data.options;
                                            this.option_settings_currency=data.options.currency;
                                            this.image_modified_details.width=this.option_settings.image_width;
                                            this.image_modified_details.height=this.option_settings.image_height;
                                            //this.image_modified_details.height=Math.round(this.image_modified_details.width/this.option_settings.aspect_ratio);
                                            this.image_modified_details.width =Math.round(this.image_modified_details.width * this.option_settings.image_scale);
                                            this.image_modified_details.height =Math.round(this.image_modified_details.height * this.option_settings.image_scale);
                                            
                                          }
                                            this.more_status=data.more;
                                          for (var i = 0; i < (data.products.length); i++)
                                            {
                                            this.recieved_data.push(data.products[i]);
                                            }
                                          if(typeof data.filters === 'undefined') {
                                            this.filters_data = this.FiltersService.filter_page_display_data;
                                            // does not exist
                                          }
                                          else {
                                            this.filters_data = [];
                                            this.FiltersService.filter_page_display_data =[];

                                                for (var j = 0; j < (data.filters.length); j++)
                                                {
                                                  this.filters_data.push(data.filters[j]);
                                                } 
                                                this.FiltersService.filter_page_display_data=this.filters_data;
                                                  
                                          }
                                    
                                        if (isFirstLoad) {
                                        
                                          event.target.complete();
                                        }
                                        

                                        this.append_item += data.products.length;
                                        this.viewEntered=true;
                                  }
                                
                                  this.LoadingService.stopLoading();
                    });
    }

  doInfinite(event:any) 
    {
          if(this.more_status==true)
          {
            this.getProducts(true, event);
          }
    }

  open(data:any)
    {
          let randno:number =this.dataService.getRandomInt(20001,30000); 
          this.nav.navigateForward(this.dataService.tab_menu_path+'/product-detail/'+randno);
          this.dataService.current_product_id = data.link;
          this.dataService.product_attribute_tree=data.attribute_tree;
    }
    
  openCustom() 
    {
          this.menu.enable(true, 'products-list');
          this.menu.open('products-list');
    }
    
  createPopover()
    {
          //chaned here from popover to page
            this.nav.navigateForward('/filters', { state: this.filters_data});
        
    }
  load_page_content()
  {
          this.viewEntered=false;  
          this.recieved_data= [];
          this.append_item = 0;
          this.itemsIncart= [];
          // cartCount: Number;
          this.filters_data= [];
          this.FiltersService.isFilterApplied.next(false);
          this.getProducts(false, "");
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
            let randno:number =this.dataService.getRandomInt(10001,20000); 
            this.nav.navigateForward( this.dataService.tab_menu_path+'/search/'+randno);
          }else{
            this.searchValue='';
            this.dataService.globalSearch='';
          }
    }
}
    