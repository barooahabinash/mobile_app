import { Component, OnInit } from '@angular/core';
import { DataService } from './../../api/data.service';
import { NavController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {

  pages: any = [];
  pop_up:any=[];
  currentPageOnlieStatus:boolean=true;
  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'no',
    clearsessioncache : 'no',
    cleardata : 'no',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    hideurlbar:'yes',
    hidenavigationbuttons:'yes',
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    usewkwebview : 'yes',
    toolbarposition : 'top'//iOS only 
};
  constructor(private dataService:DataService,private nav: NavController,private iab: InAppBrowser,private ToastService:ToastService,private LoadingService:LoadingService,private AlertMessageService:AlertMessageService,private StorageService:StorageService,private AuthenticationService:AuthenticationService,private ApiConnectionService:ApiConnectionService) { }

  ngOnInit() 
    {
        this.load_page_content();
    }
  ionViewWillEnter()
    {
        this.AuthenticationService.getLoggedInStatus();
    }
  load_page_content()
    {
        this.getMoreData();
        this.AuthenticationService.getLoggedInStatus();
    }

  getMoreData()
    {
        this.pages=[];
        this.LoadingService.showLoading();
        this.ApiConnectionService.post({url:'/mobile_app/v1/more'}).then(data => {
        if (data !== undefined && data !='' && data != null){
          for (var i = 0; i < (data.pages.length); i++)
            {
              if (data.pages[i].display_name.includes('&amp;'))
              {
                data.pages[i].display_name = data.pages[i].display_name.replace('amp;','');
              }
              this.pages.push(data.pages[i]);
            }

        }
        this.LoadingService.stopLoading(); 
        });
      
    }

  navigateFromList(moredetails: any)
    {

          if (moredetails.link.includes('popup_'))
          {
            moredetails.link = moredetails.link.replace('}','');
            moredetails.link = moredetails.link.replace('{','');
            this.pop_up = moredetails.link.split(','); 
            for (var i = 0; i< this.pop_up.length; i++)
            {
              var url = this.pop_up[i];
              if (url.includes('link'))
              {
                  url = url.replace('"link"','');
                  url = url.replace(':','');
              }
            }
            
            this.openWithInAppBrowser(url);
          }
          else
          {
            //this.nav.navigateForward('/links');
            this.dataService.morePageLink = moredetails.link;
            this.dataService.morePageLinkDisplayName = moredetails.display_name;
            // this.nav.navigateRoot(this.dataService.tab_menu_path+'/links');
            this.nav.navigateForward(this.dataService.tab_menu_path+'/links');
          }
    }

  public openWithInAppBrowser(url : string)
    {
          let target = "_blank";
          this.iab.create(url,target,this.options);
      
    }

  retry_page_content()
    {
          this.ApiConnectionService.networkConnectionCheck();
          this.load_page_content();
    }
  async logout()
    {
          await this.AuthenticationService.logout();
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
