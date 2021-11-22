import { Component, OnInit,PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Pipe({ name: 'safeHtml'})
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit,PipeTransform {
  orderHistoryImage:boolean =false;
  orderhistory_data:any = [];
  viewEntered:boolean=false;
  constructor(private domSanitizer: DomSanitizer,private LoadingService:LoadingService,private ApiConnectionService:ApiConnectionService) { }
  transform(value:any) 
    {
        return this.domSanitizer.bypassSecurityTrustHtml(value);
    }

  ngOnInit() 
    {
    }

  ionViewWillEnter()
    {
          this.load_page_content();
    }
  load_page_content()
    {
          this.orderHistoryImage=false;
          this.orderhistory_data=[]
          this.viewEntered=false;
          this.getPageData();
    }
  getPageData()
    {  
          let orderhistory_url  = '/mobile_app/v1/order_history'
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:orderhistory_url}).then(async data => {
            if (data !== undefined && data !='' && data != null){
              console.log(data);
              this.orderhistory_data=data.account_summary;
            }
            this.viewEntered=true;
            this.LoadingService.stopLoading(); 
          });
      
    }
  retry_page_content()
    {
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
