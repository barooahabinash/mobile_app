import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Plugins,NetworkStatus, PluginListenerHandle} from '@capacitor/core';
import { Platform} from '@ionic/angular';
import { ToastService } from '../toast/toast.service';
import { Device } from 'src/app/interfaces/device.interface';
import { HttpRequest} from 'src/app/interfaces/http-request.interface';

const { Device } = Plugins;
const { Network } = Plugins;


const builderConfig = require('../../../builder/builder.config.json');
@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {

  networkStatus: NetworkStatus;
  networkListener: PluginListenerHandle;
  onlineStatus:boolean=true;
  api_token:string='eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9';
  client_url:string = builderConfig.clientUrl;
  client_app_name:string=builderConfig.clientAppName;
  identifier_key:string=builderConfig.identifierKey;
  vs_user:string='lijo';
  cookie:string = '';
  deviceInfo: Device = {
    api_token: '',
    model: '',
    platform: '',
    version: '',
    build: '',
    identifier: '',
    network: '',
    uuid: '',
    screen: {
        width: 0,
        height: 0
    }
};

  constructor(private http: HTTP,platform: Platform,private ToastService:ToastService) 
    { 
        platform.ready().then(() => {
          this.deviceInfo.screen.width= platform.width();
          this.deviceInfo.screen.height= platform.height();
        });
        this.getDeviceInfo(); 

    }
  
  async getDeviceInfo()
    {
          const info = await Device.getInfo();
          this.deviceInfo.api_token=this.api_token;
          this.deviceInfo.model=info.model;
          this.deviceInfo.platform=info.platform;
          this.deviceInfo.version=info.osVersion;
          this.deviceInfo.build=info.appVersion;
          this.deviceInfo.identifier=this.identifier_key;
          //this.device_info.identifier=info.appId;
          this.deviceInfo.uuid= info.uuid;
    }


  async networkConnectionCheck()
    {
          if(this.networkStatus == null || this.networkStatus === undefined)
          {
              this.networkListener = Network.addListener('networkStatusChange', (status) => {
                this.showNetworkStatus(status);
              });
          
              this.networkStatus = await Network.getStatus();
              this.showNetworkStatus(this.networkStatus);
              if(this.networkStatus.connected != undefined)
                {
                  this.onlineStatus= this.networkStatus.connected;
                }
        }else{
          this.checknetworkstatus();
        }
    }
  showNetworkStatus(networkCurrentStatus:any)
    {
          let networkshowmsg:string='';
          if(networkCurrentStatus.connected != undefined && ((networkCurrentStatus.connected != this.networkStatus.connected) || (networkCurrentStatus.connectionType != this.networkStatus.connectionType)))
          {
            this.networkStatus=networkCurrentStatus;

              if(networkCurrentStatus.connected == true)
              {
              networkshowmsg='Network Connected..';
              this.ToastService.presentToastMsg(networkshowmsg);
              }
              else
              {
                networkshowmsg='Seems you are offline.Please check your internet connection.';
                this.ToastService.presentToastMsg(networkshowmsg);
              }
            
          }else if(networkCurrentStatus.connected != undefined && networkCurrentStatus.connected == false)
          {
                this.networkStatus=networkCurrentStatus;
                networkshowmsg='Seems you are offline.Please check your internet connection.';
                this.ToastService.presentToastMsg(networkshowmsg);
          }
          this.networkStatus=networkCurrentStatus;
          //this.checknetworkstatus();

    } 
  checknetworkstatus()
    {
            if(this.networkStatus == null || this.networkStatus === undefined)
            {
                    this.onlineStatus=false;
            }else{
                    if( this.networkStatus.connected !== undefined)
                    {
                      this.onlineStatus= this.networkStatus.connected;
                      this.deviceInfo.network=this.networkStatus.connectionType;
                    }else
                    {
                      this.onlineStatus=false;
                    }
            }

            return this.onlineStatus;
    }

  serverResponseCheck(res_data:any)
    {
          if(res_data == undefined)
          {
            this.onlineStatus=false;
          }
    }

      /**
       * 
       * @param callback 
       */
  async apiRequest(request: HttpRequest, callback: Function) 
    {

          // Check the network status of the device.
          await this.networkConnectionCheck();
          if (this.checknetworkstatus()) {

                  if (!request.headers) {
                      request['headers'] = {};
                  }

                  request.headers['Authorization'] = 'api_token: ' + this.api_token;
                  request.headers['VSUSER'] = this.vs_user;

                  console.log(request);

                  try {
                      const response = await callback(request);
                      const data = JSON.parse(response.data);
                      this.serverResponseCheck(data);
                      return data;
                  }

                  catch (error) {
                      console.log('An error occurred: ');
                      console.log(error.error);
                  }

            }else
            {
                  return null;
            }


    }

    /**
     * Performs a GET request with the data provided in a HttpRequest object.
     * 
     * @param options 
     * @returns 
     */
  get(options: HttpRequest) 
    {
          return this.apiRequest(options, async (request: HttpRequest) => {
              return this.http.get(this.client_url + request.url, request.getParams, request.headers);
          });
    }

    /**
     * Performs a POST request with the data provided in a HttpRequest object.
     * 
     * @param options 
     * @returns 
     */
  post(options: HttpRequest) 
    {
          return this.apiRequest(options, async (request: HttpRequest) => {

              if (! request.postParams) {
                  request['postParams'] = {};
              }

              for (let key in this.deviceInfo) {
                  request.postParams[key] = this.deviceInfo[key];
              }

              return this.http.post(
                  this.client_url + request.url, 
                  request.postParams, 
                  request.headers
              );
          });
    }

    /**
     * Performs a PUT request with the data provided in a HttpRequest object.
     * 
     * @param options 
     * @returns 
     */
  put(options: HttpRequest) 
    {
          return this.apiRequest(options, async (request: HttpRequest) => {
              return this.http.put(this.client_url + request.url, request.postParams, request.headers);
          });
    }

    /**
     * Performs a DELETE request with the data provided in a HttpRequest object.
     * 
     * @param options 
     * @returns 
     */
  delete(options: HttpRequest)
    {
          return this.apiRequest(options, async (request: HttpRequest) => {
              return this.http.delete(this.client_url + request.url, request.getParams, request.headers);
          });
    }

    /**
     * Performs get cookie string value.
     * 
     * @param linkVal 
     * @returns 
     */
    getCookieStringVal(linkVal:string)
    {
      this.cookie = this.http.getCookieString(this.client_url+ linkVal);
    }


}
