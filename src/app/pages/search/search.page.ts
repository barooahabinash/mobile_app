import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DataService, ProductList } from './../../api/data.service';
import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';
const { BarcodeScanner } = Plugins;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit , AfterViewInit,OnDestroy {

  recieved_data: Array<ProductList> = [];
  filters_data:any = [];
  append_item = 0;
  more_status:boolean=false;
  searchText:string = '';
  hasCancelled:boolean;
  option_settings:any =[];
  option_settings_currency:any=[];
  image_modified_details:any ={'width':0,'height':0}
  searchListImage:boolean =false;
  barcode_scan_status:boolean=false;
  searchValue:any='';
  viewEntered:boolean;
  barcodeResult:any=null;
  scanActive:boolean=false;


  constructor(private dataService:DataService, private ToastService:ToastService,private nav: NavController,private LoadingService:LoadingService,private AlertMessageService:AlertMessageService,private ApiConnectionService:ApiConnectionService) { }

  ngOnInit()
    {
          this.searchValue=this.dataService.globalSearch;
          this.dataService.globalSearch='';
          this.viewEntered=false;
          this.updateSearchResults(false, this.searchValue);
    }
  ngAfterViewInit()
    {
          if(this.dataService.barcode_scan==true)
          {
            BarcodeScanner.prepare();
          }
    }
  ngOnDestroy()
    {
          BarcodeScanner.stopScan();
    }
  ionViewWillEnter()
    {
          this.barcode_scan_status=this.dataService.barcode_scan;
    }
  async startScanner()
    {
          this.scanActive = true;
          const allowed = await this.checkPermission();
          if(allowed)
          {
              const result=await BarcodeScanner.startScan();
              if(result.hasContent)
              {
                this.barcodeResult=result.content;
                this.scanActive=false;
                this.searchValue=this.barcodeResult;
                this.searchText=this.barcodeResult;
                this.retry_page_content();
                //await this.AlertMessageService.presentAlert('Barcode Content',result.content);
              }
            
          }
    }
  async checkPermission()
    {
          const status = await BarcodeScanner.checkPermission({ force: true});
          if(status.granted)
          {
              return true;
          }else if(status.denied)
          {
                const confirmreslt = await this.AlertMessageService.confirmationAlert(
                  'No Permission','Please allow camera access in your settings?','Cancel','Open Settings'
                );
                
                if(confirmreslt)
                {
                  BarcodeScanner.openAppSettings();
                  return false;
                }
          }else{
            return false;
          }

      
    }
  stopScanner()
    {
          BarcodeScanner.stopScan();
          this.scanActive = false;
    }
  updateSearchResults(isFirstLoad: boolean, userInput: any)
    {
      
          if (this.hasCancelled)
          {
            this.recieved_data = [];
            this.hasCancelled = false;
            this.append_item=0;
          }

          if (!isFirstLoad)
          {
            this.searchText = String(userInput);
            this.recieved_data = [];
            this.append_item=0;
            
          }
          
          let product_url  = '/mobile_app/v1/search/' + this.searchText;
            if (isFirstLoad)
              product_url = product_url + '?start='+ this.append_item + '&key=' + Math.random();
            else
              this.LoadingService.showLoading();

            
            this.ApiConnectionService.post({url:product_url}).then(data => {
                    
                    if(this.append_item == 0)
                    {
                      this.LoadingService.stopLoading(); 
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
                                  if (this.recieved_data?.length === 0){
                                    this.ToastService.presentToastMsg("Sorry, No items!")
                                    if (isFirstLoad)
                                  userInput.target.complete();
                            
                                  this.append_item += data.products.length;

                                  }
                                  if (isFirstLoad)
                                  userInput.target.complete();
                            
                                  this.append_item += data.products.length;
                                  isFirstLoad = false;
                                  this.viewEntered=true;
                    }
              });

        
    }
    
  doInfinite(userInput:any) 
    {
          if(this.more_status==true)
          {
          this.updateSearchResults(true, userInput);
          }
    }

  open(data:any)
    {
          this.dataService.current_product_id = data.link;
          this.dataService.product_attribute_tree=data.attribute_tree;
          let randno:number =this.dataService.getRandomInt(10001,20000);
          this.nav.navigateForward(this.dataService.tab_menu_path+'/product-detail/'+randno);
      
    }

  onCancel(event: any)
    {
          this.hasCancelled = true;
    }

  onClear(event: any)
    {
          this.hasCancelled = true;
    }

  load_page_content()
    {
        this.viewEntered=false; 
        this.recieved_data= [];
        this.append_item = 0;
        this.filters_data= [];
        this.scanActive = false;
        this.updateSearchResults(false, this.searchText);
    }
  retry_page_content()
  {
        this.ApiConnectionService.networkConnectionCheck();
        this.load_page_content();
  }
}
