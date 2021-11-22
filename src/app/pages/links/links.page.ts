import { Component, OnInit ,PipeTransform, Pipe } from '@angular/core';
import { DataService } from './../../api/data.service';
import { DomSanitizer } from '@angular/platform-browser'
import { NavController} from '@ionic/angular';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Pipe({ name: 'safeHtml'})
@Component({
  selector: 'app-links',
  templateUrl: './links.page.html',
  styleUrls: ['./links.page.scss'],
})
export class LinksPage implements OnInit,PipeTransform {

  pageHtml:string='';
  isAccount:boolean;
  isApp_info:boolean;
  currentPageOnlieStatus:boolean=true;
  constructor(private dataService:DataService,private domSanitizer: DomSanitizer,private ToastService:ToastService,private nav: NavController,private openNativeSettings: OpenNativeSettings,private LoadingService:LoadingService,private AlertMessageService:AlertMessageService,private StorageService:StorageService,private AuthenticationService:AuthenticationService,private ApiConnectionService:ApiConnectionService) { }
  transform(value:any) 
    {
          return this.domSanitizer.bypassSecurityTrustHtml(value);
    }
  ngOnInit() 
    {
          this.load_page_content();
    }
  load_page_content()
    {
          this.AuthenticationService.getLoggedInStatus();
          this.getPageData();
    }
  getPageData()
    {
          this.dataService.morePageLink = this.dataService.morePageLink.replace('cms_','');
          if (this.dataService.morePageLink === 'account'){

            this.isAccount = true;
          }
          else if (this.dataService.morePageLink === 'app_info'){

            this.isApp_info = true;
          }
          let product_url  = '/mobile_app/v1/more/' + this.dataService.morePageLink;
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:product_url}).then(async data => {
            if (data !== undefined && data !='' && data != null){
              this.pageHtml = data.page;
            }
            this.LoadingService.stopLoading();
          });
      
    }
    
  openSettings()
    {

          // open settings
          //edit the Root.plist(Preference items) or remove it in xcode to add or remove the settings in it for ios
          this.openNativeSettings.open("application_details").then(val => {
            console.log('success')
          });

    }
  async logout()
    {
          await this.AuthenticationService.logout();
          this.nav.pop();
    }
  
  retry_page_content()
    {
          this.ApiConnectionService.networkConnectionCheck();
          this.load_page_content();
    }
  order_history()
    {
          this.nav.navigateForward(this.dataService.tab_menu_path+'/order-history');
    }
  address_book()
    {
          this.nav.navigateForward(this.dataService.tab_menu_path+'/address-book');
    }
}
