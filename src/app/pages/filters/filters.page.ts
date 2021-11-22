import { Component, OnInit } from '@angular/core';
import { NavController} from '@ionic/angular';
import { DataService} from './../../api/data.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { FiltersService } from 'src/app/services/filters/filters.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit {

  availableFilters:any = [];
  filtersOnFirstLoad:any;
  defaultSelectedRadio = "radio_2";
  //Get value on ionChange on IonRadioGroup
  selectedRadioGroup:any;
  //Get value on ionSelect on IonRadio item
  selectedRadioItem:any;
  manufacturer = {'manufacturer' : []};
  tag = {'tag' : []};
  selectedData ={'manufacturer' : [], 'tag' : [],'category' : [],'priceband' : [],'sale' : [],'sale_flag' : [],'rating' : [],'stock_status_flag' : [],'attributevalue' : [],'keywords' : [],'hidden_flag' : []} ;
  hasManufacturer:boolean;
  hasTag:boolean;
  hasCategory:boolean;
  hasPriceband:boolean;
  hasSale:boolean;
  hasSale_flag:boolean;
  hasRating:boolean;
  hasStock_status_flag:boolean;
  hasAttributevalue:boolean;
  hasKeywords:boolean;
  hasHidden_flag:boolean;



  constructor(private dataService:DataService,public router: Router,private nav: NavController,private LoadingService:LoadingService,private FiltersService:FiltersService,private ApiConnectionService:ApiConnectionService) {
    
          if (router.getCurrentNavigation().extras.state) {
          const filters = this.router.getCurrentNavigation().extras.state;
          this.availableFilters = filters;
          }
    }

  ngOnInit() 
    {
          this.filtersOnFirstLoad = JSON.parse(JSON.stringify(this.FiltersService.filterData));
    }

  async getFilterData(showLoading:boolean = true)
    {
          if (showLoading) this.LoadingService.showLoading();
          //this.dataService.current_product = this.dataService.current_product.replace('l_','');
          let product_url  = '/mobile_app/v1/filters/' + this.dataService.current_product.replace('l_',''); 

          this.ApiConnectionService.post({url: product_url, postParams: {filters:JSON.stringify(this.FiltersService.filterData)}}).then(async data => {
            if (data !== undefined && data !='' && data != null){

              this.availableFilters = data.filters;
              this.FiltersService.filter_page_display_data= data.filters;
            }
            this.LoadingService.stopLoading();
          });
    }

  ClosePopover()
     {
          this.FiltersService.filterData = this.filtersOnFirstLoad;
     }
  ClearPopover()
    {
         //  this.popover.dismiss('clear') //dont change the data value clear ,used in product-list.page.ts for  popoverElement.onDidDismiss() check
          this.FiltersService.filterData = [];
          this.selectedData = {'manufacturer' : [], 'tag' : [],'category' : [],'priceband' : [],'sale' : [],'sale_flag' : [],'rating' : [],'stock_status_flag' : [],'attributevalue' : [],'keywords' : [],'hidden_flag' : []}; 
          this.getFilterData(false);
          this.FiltersService.isFilterApplied.next(true);
    }

  radioGroupChange(event) 
    {
          //Here you get the values, if values is not undefined push the value to an array,else pop the last object from array
          if(this.selectedData.manufacturer.length == 0 && this.selectedData.tag.length==0 && this.selectedData.category.length==0 && this.selectedData.priceband.length == 0 && this.selectedData.sale.length == 0 && this.selectedData.sale_flag.length == 0 && this.selectedData.rating.length == 0 && this.selectedData.stock_status_flag.length == 0 && this.selectedData.attributevalue.length == 0 && this.selectedData.keywords.length == 0 && this.selectedData.hidden_flag.length == 0)
          {
              if((this.FiltersService.filterData.manufacturer != undefined) || (this.FiltersService.filterData.tag != undefined) || (this.FiltersService.filterData.category != undefined) || (this.FiltersService.filterData.priceband != undefined) || (this.FiltersService.filterData.sale != undefined) || (this.FiltersService.filterData.sale_flag != undefined) || (this.FiltersService.filterData.rating != undefined) || (this.FiltersService.filterData.stock_status_flag != undefined) || (this.FiltersService.filterData.attributevalue != undefined) || (this.FiltersService.filterData.keywords != undefined) || (this.FiltersService.filterData.hidden_flag != undefined))
              {
                this.selectedData=this.FiltersService.filterData;
              }
          }
          var type_and_id = event.split("*#*");
          //var name : string = event.toString();
          if (type_and_id.length >0 && type_and_id[0]=='manufacturer')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.manufacturer.length; i ++)
            {
              if (this.selectedData.manufacturer[i] === type_and_id[1])
              {
                this.selectedData.manufacturer.splice(i,1);
                this.hasManufacturer = true;
              }
            }
            if (!this.hasManufacturer)
            {
              this.selectedData.manufacturer.push(type_and_id[1]);

            }
          
            this.hasManufacturer = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();

          }
          if (type_and_id.length >0 && type_and_id[0]=='tag')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.tag.length; i ++)
            {
              if (this.selectedData.tag[i] === type_and_id[1])
              {
                this.selectedData.tag.splice(i,1);
                this.hasTag = true;
              }
            }
            if (!this.hasTag)
            {
              this.selectedData.tag.push(type_and_id[1]);
            }
            this.hasTag = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }
          if (type_and_id.length >0 && type_and_id[0]=='category')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.category.length; i ++)
            {
              if (this.selectedData.category[i] === type_and_id[1])
              {
                this.selectedData.category.splice(i,1);
                this.hasCategory = true;
              }
            }
            if (!this.hasCategory)
            {
              this.selectedData.category.push(type_and_id[1]);
            }
            this.hasCategory = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }
          if (type_and_id.length >0 && type_and_id[0]=='priceband')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.priceband.length; i ++)
            {
              if (this.selectedData.priceband[i] === type_and_id[1])
              {
                this.selectedData.priceband.splice(i,1);
                this.hasPriceband = true;
              }
            }
            if (!this.hasPriceband)
            {
              this.selectedData.priceband.push(type_and_id[1]);
            }
            this.hasPriceband = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }
          if (type_and_id.length >0 && type_and_id[0]=='sale')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.sale.length; i ++)
            {
              if (this.selectedData.sale[i] === type_and_id[1])
              {
                this.selectedData.sale.splice(i,1);
                this.hasSale = true;
              }
            }
            if (!this.hasSale)
            {
              this.selectedData.sale.push(type_and_id[1]);
            }
            this.hasSale = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }
          if (type_and_id.length >0 && type_and_id[0]=='sale_flag')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.sale_flag.length; i ++)
            {
              if (this.selectedData.sale_flag[i] === type_and_id[1])
              {
                this.selectedData.sale_flag.splice(i,1);
                this.hasSale_flag = true;
              }
            }
            if (!this.hasSale_flag)
            {
              this.selectedData.sale_flag.push(type_and_id[1]);
            }
            this.hasSale_flag = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }
          if (type_and_id.length >0 && type_and_id[0]=='rating')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.rating.length; i ++)
            {
              if (this.selectedData.rating[i] === type_and_id[1])
              {
                this.selectedData.rating.splice(i,1);
                this.hasRating = true;
              }
            }
            if (!this.hasRating)
            {
              this.selectedData.rating.push(type_and_id[1]);
            }
            this.hasRating = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }
          if (type_and_id.length >0 && type_and_id[0]=='stock_status_flag')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.stock_status_flag.length; i ++)
            {
              if (this.selectedData.stock_status_flag[i] === type_and_id[1])
              {
                this.selectedData.stock_status_flag.splice(i,1);
                this.hasStock_status_flag = true;
              }
            }
            if (!this.hasStock_status_flag)
            {
              this.selectedData.stock_status_flag.push(type_and_id[1]);
            }
            this.hasStock_status_flag = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }
          if (type_and_id.length >0 && type_and_id[0]=='attributevalue')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.attributevalue.length; i ++)
            {
              if (this.selectedData.attributevalue[i] === type_and_id[1])
              {
                this.selectedData.attributevalue.splice(i,1);
                this.hasAttributevalue = true;
              }
            }
            if (!this.hasAttributevalue)
            {
              this.selectedData.attributevalue.push(type_and_id[1]);
            }
            this.hasAttributevalue = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }
          if (type_and_id.length >0 && type_and_id[0]=='keywords')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.keywords.length; i ++)
            {
              if (this.selectedData.keywords[i] === type_and_id[1])
              {
                this.selectedData.keywords.splice(i,1);
                this.hasKeywords = true;
              }
            }
            if (!this.hasKeywords)
            {
              this.selectedData.keywords.push(type_and_id[1]);
            }
            this.hasKeywords = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }
          if (type_and_id.length >0 && type_and_id[0]=='hidden_flag')
          {
            this.FiltersService.filterData = [];
            for ( var i = 0; i < this.selectedData.hidden_flag.length; i ++)
            {
              if (this.selectedData.hidden_flag[i] === type_and_id[1])
              {
                this.selectedData.hidden_flag.splice(i,1);
                this.hasHidden_flag = true;
              }
            }
            if (!this.hasHidden_flag)
            {
              this.selectedData.hidden_flag.push(type_and_id[1]);
            }
            this.hasHidden_flag = false;
            this.FiltersService.filterData = this.selectedData;
            this.getFilterData();
          }

    }

  radioFocus(event) 
    {
          console.log("radioFocus",event);
    }
  radioSelect(event) 
    {
          console.log("radioSelect",event.detail);
          //  this.selectedRadioItem = event.detail;
    }
  radioBlur() 
    {
          console.log("radioBlur");
    }

  applyFilters()
    {
            //this.popover.dismiss('apply');//dont change the data value apply ,used in product-list.page.ts for  popoverElement.onDidDismiss() check
          this.nav.pop()
          this.FiltersService.isFilterApplied.next(true);

    }

  load_page_content()
    {
          this.getFilterData();
    }
  retry_page_content()
    {
          this.ApiConnectionService.networkConnectionCheck();
          this.load_page_content();
    }
}
