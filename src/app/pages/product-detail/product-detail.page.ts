import { DomSanitizer } from '@angular/platform-browser'
import { Component, OnInit, ViewChild, PipeTransform, Pipe, ElementRef} from '@angular/core';
import { DataService} from './../../api/data.service';
import { IonSlides, NavController,PickerController} from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { MenuController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

const { Share } = Plugins;
@Pipe({ name: 'safeHtml'})

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit, PipeTransform {

  
  product_link:String;
  product_details: any = [];
  product_images: String[] = [];
  permananent_product_images: String[] = [];
  actualPrice:string = '';
  salePrice:string = '';
  description:String = '';
  colorButtonTitle:string = 'Choose Color';
  sizeButtonTitle:string = 'Choose Size';
  attribute_head_one:string='';
  attribute_head_two:string='';
  attribute_count:number=0;
  product_details_description:any='';

  colorArray: string[] = [];
  sizeArray: string[] = [];
  cartArray: any = [];
  sharingDetails: any = [];
  itemsIncart:any = [];
  itemsWishlist:any = [];
  outofstockerrflag:boolean=false;
  productImage:boolean =false;
  productFields = {product_id:'',title:'',total_stock:'',image:'',price:'',size:'',color:'',quantity:'1',stock:'',parent_product_id:'',p_product_id:'',currency_symbol:'',currency_position:'',currency_postfix:'',price_breaks_count:1,price_breaks_details:'',summary:''}; //stock is each color and size stock

  //login in case of adding to wishlist
  

  option_settings:any ={'alt_basket_button':'','aspect_ratio':'','image_height':'','image_scale':'','image_url_prefix':'','image_width':'','multi_price_prefix':'','price_style':'','product_width':'','sale_price_full_prefix':'','sale_price_style':'','show_name':'','show_price':'','show_was_price_on_sale':'','terms_link':'','currency': {'symbol':'', 'position':'','postfix':''}};
  option_settings_currency:any={'symbol':'', 'position':'','postfix':''};
  image_modified_details:any ={'width':0,'height':0}
  colorswatchArray: any = [];
  viewEntered:boolean=false;
  size_extra_info:any={'link':'','title':'','type':''};
  product_details_code:string='';
  price_breaks_details:any={};
  price_breaks_count:number=0;
  searchValue:any='';
  isShown_sash:boolean=true;
  prod_det_menu_dymic_no:any='';
  slideOptsOne = {
    initialSlide: 0,
    autoplay:false,
    zoom:{
      maxRatio : 2
    }
   };
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
@ViewChild('adSlider') slides:IonSlides;
@ViewChild('wishlistDivClick') wishlistDivClick: ElementRef<HTMLElement>;
  constructor(private dataService:DataService,private nav: NavController,private pickerController: PickerController,private menu: MenuController,private ToastService:ToastService,private iab: InAppBrowser,private sanitized: DomSanitizer,private LoadingService:LoadingService,private StorageService:StorageService,private CartService:CartService,private AuthenticationService:AuthenticationService,private ApiConnectionService:ApiConnectionService) { 
  }
  transform(value:any) 
    {
          return this.sanitized.bypassSecurityTrustHtml(value);
    }
  ngOnInit() 
    {
            this.load_page_content();
    }
  load_page_content()
    {
          this.isShown_sash=true;
          this.viewEntered=false;
          this.getProductDetail();
          this.AuthenticationService.userHasLogged = true;
          this.prod_det_menu_dymic_no=this.dataService.getRandomInt(30001,40000)+'#***#'+this.dataService.current_product_id;//this one is for make cart menu id dynamic .When we open product detail page and open cart then click the image on the cart,it will open that item product detail page .If we click cart again,the cart open in the backgroud.To solve this make menuid dynamic 
    }
  ionViewWillEnter()
    {
          this.AuthenticationService.userHasLogged = true;
    }
  ionViewDidEnter()
    {
          //this.viewEntered=true;
    }
  async getProductDetail()
    {
          //this.dataService.current_product = this.dataService.current_product.replace('p_','');
          let product_url  = '/mobile_app/v1/product/' +this.dataService.current_product_id.replace('p_','');; 
          this.LoadingService.showLoading();
          this.ApiConnectionService.post({url:product_url}).then(async data => {
            this.LoadingService.stopLoading(); 
            if (data !== undefined && data !='' && data != null){
              let colorswatch_bold_index:any=0;
              this.colorswatchArray=[];
              Object.assign(this.option_settings, data.options);
              Object.assign(this.option_settings_currency, data.options.currency);
              this.image_modified_details.width=this.option_settings.image_width;
              this.image_modified_details.height=this.option_settings.image_height;
              //this.image_modified_details.height=Math.round(this.image_modified_details.width/this.option_settings.aspect_ratio);
              this.image_modified_details.width =Math.round(this.image_modified_details.width * this.option_settings.image_scale);
              this.image_modified_details.height =Math.round(this.image_modified_details.height * this.option_settings.image_scale);
              

              this.product_details_description=data.product.description;
              this.product_details = data.product;
              this.actualPrice=  data.product.price_breaks[1].price;
              this.salePrice=  data.product.price_breaks[1].sale_price;
              this.price_breaks_details=data.product.price_breaks;
              this.price_breaks_count=this.dataService.objectLength(this.price_breaks_details);
              this.product_details_code=data.product.code;

              this.sharingDetails = data.product.sharing;
                for (var i = 0; i < (data.product.images.length); i++){
                this.product_images.push(this.ApiConnectionService.client_url + data.product.images[i]);
                this.permananent_product_images.push(this.ApiConnectionService.client_url + data.product.images[i]);
              }
              this.attribute_count=data.product.attributes.length;
                for (var i = 0; i < (data.product.attributes.length); i++)
                  {
                        if (i == 0)//&& (data.product.attributes[i].name == 'Colour' || data.product.attributes[i].name == 'Size')// dont delete this code
                          {
                            this.attribute_head_one = data.product.attributes[i].name;
                            this.colorButtonTitle = 'Choose ' + data.product.attributes[i].name;

                                    for (var j = 0; j < (data.product.attributes[i].values.length); j++)
                                    {

                                        this.colorArray.push(data.product.attributes[i].values[j].name);
                                        /*colour Image section start */
                                        if((data.product.attributes[i].values[j].swatch_image !='' && data.product.attributes[i].values[j].swatch_image !=null) ||(data.product.attributes[i].values[j].swatch_colour!='' && data.product.attributes[i].values[j].swatch_colour !=null))
                                        {
                                          
                                            let border_active:boolean=false;
                                            if(this.colorswatchArray.length==0)
                                            {
                                              border_active=true;
                                            }
                                          if(data.product.attributes[i].values[j].id == this.dataService.product_attribute_tree)
                                          {
                                            border_active=true;
                                          }
                                          this.colorswatchArray.push({'name':data.product.attributes[i].values[j].name,'swatch_image':data.options.image_url_prefix+''+data.product.attributes[i].values[j].swatch_image,'id':data.product.attributes[i].values[j].id,'swatch_colour':data.product.attributes[i].values[j].swatch_colour,'bordercss':''});
                                          if(border_active==true)
                                          {
                                            colorswatch_bold_index= this.colorswatchArray.length -1;
                                          }
                                          border_active=false;
                                        }
                                        /*colour Image section end */

                                        /* product has only one items in attribute one, to load attribute two of first attribute one start */
                                        if(data.product.attributes[i].values.length == 1 && j == 0 && this.colorswatchArray.length==0)
                                        {
                                          this.colorButtonTitle = data.product.attributes[i].name+': ' + data.product.attributes[i].values[j].name;
                                          this.productFields.color = data.product.attributes[i].values[j].name;
                                          this.change_slide_image();
                                          this.loadsizeOptionfromColorOption();
                                        }
                                          /* end */
                                          
                                    }
                              
                            }
                        else
                          {
                            this.attribute_head_two = data.product.attributes[i].name;
                            this.sizeButtonTitle = 'Choose ' + data.product.attributes[i].name;
                            
                                  
                                  if(data.product.attributes[i].extra_info != null && data.product.attributes[i].extra_info.title !=undefined && data.product.attributes[i].extra_info.title !="")
                                  {
                                  this.size_extra_info.link=data.product.attributes[i].extra_info.link;
                                  this.size_extra_info.type=data.product.attributes[i].extra_info.type;
                                  this.size_extra_info.title=data.product.attributes[i].extra_info.title;
                                  }
                            

                          
                          }
                  }
                  /*colour Image section exist */
                if(this.colorswatchArray.length >0)
                {
                  this.changecolornimage(this.colorswatchArray[colorswatch_bold_index],colorswatch_bold_index);
                  
                }
                /* there is no colour, only size exist */  
                if(this.colorArray.length ==0)// need to delete later
                {
                    this.sizeArray=[];
                    for (var i = 0; i < (data.product.attribute_children.length); i++){
                      if (data.product.attribute_children[i].name == 'Size'){
            
                        for (var j = 0; j < (data.product.attribute_children[i].values.length); j++){
            
                            this.sizeArray.push(data.product.attribute_children[i].values[j].name)
                          }
                        }
                      }
                }
              this.productFields.title = data.product.title;
              this.productFields.total_stock =data.product.total_stock;
              this.productFields.parent_product_id =data.product.parent_product_id;
              this.productFields.p_product_id=this.dataService.current_product_id;//'p_' and parent_product_id
              this.productFields.currency_symbol =data.options.currency.symbol;
              this.productFields.currency_position =data.options.currency.position;
              this.productFields.currency_postfix =data.options.currency.postfix;
              this.productFields.price_breaks_details =this.price_breaks_details;
              this.productFields.price_breaks_count =this.price_breaks_count;
              this.outofstockerrflag=false;
              if(parseInt(data.product.total_stock) < 1)
              {
                this.outofstockerrflag=true;
              }
              if (this.product_images !== null || this.product_images !== undefined)
              {
                // this.productFields.image = JSON.stringify(this.product_images[0]);
                this.productFields.image = String (this.product_images[0]);
              }
              //Check on setting the OR condition, general syntax not working here
              //  if (this.dataService.salePrice !== undefined)
              this.changeItemPrice();
              /* if (this.salePrice !== undefined)
              {
                this.productFields.price = this.salePrice;
              }
              else
              {
              //  this.productFields.price = this.dataService.actualPrice;
                this.productFields.price = this.actualPrice;
              }*/
              }
              this.viewEntered=true;
          });
    }

  async getCartData()
    {
          // Use this if forcefully to remove cart data
          //  await this.remove('CartItems');
          this.CartService.getCartData().then(async data => {
            });
    }

  async openColourPicker()
    {
          let options = {
            buttons: [
              {
                text: "Cancel",
                role: 'cancel'
              },
              {
                text:'OK',
                handler:(value:any) => {
                  this.outofstockerrflag=false;
                  var selectedIndex:any = Object.values (value);
                  this.colorButtonTitle = this.attribute_head_one+': ' + selectedIndex[0].value;
                  this.productFields.color = selectedIndex[0].value;
                  this.change_slide_image();
                  this.slide_image_to_first();
                  this.loadsizeOptionfromColorOption();
                }
              }
            ],
            columns:[{
              name:'Colours',
              options:this.getColourColumnOptions()
            }]
          };

          let picker = await this.pickerController.create(options);
          picker.present()
    }

  getColourColumnOptions()
    {
          let options = [];
          this.colorArray.forEach(x => {
            options.push({text:x,value:x});
          });
          return options;
    }

  async openSizePicker()
    {
          let options = {
            buttons: [
              {
                text: "Cancel",
                role: 'cancel'
              },
              {
                text:'OK',
                handler:(value:any) => {
                  this.outofstockerrflag=false;
                  var selectedIndex:any = Object.values (value);
                    this.sizeButtonTitle =  this.attribute_head_two+': ' + selectedIndex[0].value;
                    this.productFields.size = selectedIndex[0].value;
                    if((selectedIndex[0].value.includes("Out of Stock")))
                    {
                        this.outofstockerrflag=true;
                    }
                    this.itemPriceSelection();
                }
              }
            ],
            columns:[{
              name:'Sizes',
              options:this.getSizeColumnOptions()
            }]
          };

            let picker = await this.pickerController.create(options);
            picker.present()
    }

  getSizeColumnOptions()
    {
          let options = [];
          this.sizeArray.forEach(x => {
          options.push({text:x,value:x});
          });
          return options;
    }

  async addToCart()
    {

          if(this.colorArray.length > 0)
          {
                    if (this.productFields.color === '')
                    {
                      this.ToastService.presentToastMsg("Please Choose "+this.attribute_head_one)
                      return;
                    }
                    else if(this.productFields.size === '' && this.sizeArray.length >0)
                    {
                      this.ToastService.presentToastMsg("Please Choose "+ this.attribute_head_two)
                      return;
                    }
                
                  

                    for (var k = 0; k< this.product_details.attribute_children.length; k++)
                    {
                    
                      for (var j = 0; j< this.product_details.attribute_children[k].values.length; j++)
                      {
                      
                        if (this.productFields.color === this.product_details.attribute_children[k].values[j].name){


                          if(this.product_details.attribute_children[k].values[j].values[1] !== undefined)
                          {
                              
                                for (var l = 0; l< this.product_details.attribute_children[k].values[j].values[1].values.length; l++)
                                {
                                
                                  if (this.productFields.size.trim() === this.product_details.attribute_children[k].values[j].values[1].values[l].name.trim()){
                                    
                                    this.productFields.product_id = this.product_details.attribute_children[k].values[j].values[1].values[l].child.product_id;
                                    this.productFields.stock=this.product_details.attribute_children[k].values[j].values[1].values[l].child.stock;
                                    this.productFields.summary=this.product_details.attribute_children[k].values[j].values[1].values[l].child.summary;
                                  
                                        if(parseInt(this.product_details.attribute_children[k].values[j].values[1].values[l].child.stock) < 1 )
                                        {
                                          console.log('out of stock');
                                            this.ToastService.presentToastMsg("Sorry,Item is out of stock")
                                            return;

                                        }

                                  }

                                }
                          }else
                          {
                                  if(this.product_details.attribute_children[k].values[j].child !== undefined)
                                  {
                                      this.productFields.product_id = this.product_details.attribute_children[k].values[j].child.product_id;
                                      this.productFields.stock=this.product_details.attribute_children[k].values[j].child.stock;
                                      this.productFields.summary=this.product_details.attribute_children[k].values[j].child.summary;
                                      if(parseInt(this.product_details.attribute_children[k].values[j].child.stock) < 1)
                                      {
                                        console.log('out of stock');
                                        this.ToastService.presentToastMsg("Sorry,Item is out of stock")
                                        return;
                                      }
                                  }

                          }

                        }

                      }
                    }
          }else if(this.colorArray.length == 0 && this.sizeArray.length >0)// need to delete later
          {
                    if(this.productFields.size === '')
                    {
                      this.ToastService.presentToastMsg("Please choose size")
                      return;
                    }
                    for (var k = 0; k< this.product_details.attribute_children.length; k++)
                    {
                    
                      for (var j = 0; j< this.product_details.attribute_children[k].values.length; j++)
                      {
                      
                        if (this.productFields.size.trim() === this.product_details.attribute_children[k].values[j].name.trim()){

                              
                            this.productFields.product_id = this.product_details.attribute_children[k].values[j].child.product_id;
                            this.productFields.stock=this.product_details.attribute_children[k].values[j].child.stock;
                            this.productFields.summary=this.product_details.attribute_children[k].values[j].child.summary;
                          
                                if(parseInt(this.product_details.attribute_children[k].values[j].child.stock) < 1 )
                                {
                                  console.log('out of stock');
                                    this.ToastService.presentToastMsg("Sorry,Item is out of stock")
                                    return;

                                }

                          

                        

                        }

                      }
                    }
          }else if ("child" in this.product_details.attribute_children)
          {
            
                          this.productFields.product_id =this.product_details.attribute_children.child.product_id;
                          this.productFields.stock=this.product_details.attribute_children.child.stock;
                          this.productFields.summary=this.product_details.attribute_children.child.summary;

                          if(parseInt(this.product_details.attribute_children.child.stock) < 1 )
                          {
                            console.log('out of stock');
                            this.ToastService.presentToastMsg("Sorry,Item is out of stock")
                            return;

                          }

          }

                if( this.productFields.product_id !="" && parseInt(this.productFields.stock) > 0)
                {
                        

                            // Have to get the cart data in case same item is added multiple times,remove the below line in case of work around
                            //  await this.getCartData();
                            await this.CartService.getCartData().then(async data => {
                                if (data !== undefined){
                                  this.itemsIncart = data;
                                  for (var k = 0; k < (this.itemsIncart.length); k++){
                                      this.cartArray.push(this.itemsIncart[k]);
                                  }
                                }
                              });

                              var isSameItem = false;

                              if (this.productFields !== null || this.productFields !== undefined)
                              {
                                //use for let instead of fo loop later, resolve the errors
                                for (var i = 0; i < (this.cartArray.length); i++){

                                  
                                      if(this.cartArray[i].product_id === this.productFields.product_id)
                                      {
                                            if(parseInt(this.productFields.stock) <= parseInt(this.cartArray[i].quantity))
                                            {
                                              this.cartArray =[];
                                              this.ToastService.presentToastMsg("Only "+this.productFields.stock+" in stock")
                                              return;

                                            }

                                            var num = +this.cartArray[i].quantity;
                                            num = num + 1;
                                            this.cartArray[i].quantity = num.toString();
                                            this.cartArray[i].price=this.CartService.changePriceBasedPriceBreaks(this.cartArray[i].price_breaks_count,this.cartArray[i].price_breaks_details,this.cartArray[i].quantity,this.cartArray[i].price);
                                            isSameItem = true;
                                      }
                                    
                                }
                                
                                if (!isSameItem) {
                                  this.cartArray.push(this.productFields);
                                }

                                this.ToastService.presentToastMsg('<ion-icon name="checkmark-outline"></ion-icon> Added to Bag!','bottom', "big-toast", [{
                                  text: 'View Bag',
                                  cssClass: 'big-toast-button',
                                  handler: () => {
                                    this.openCustom();
                                  }
                                }]);
                                
                                
                              }
                              this.StorageService.set('CartItems',this.cartArray);
                            
                              await this.CartService.getCartData().then(async data => {
                              });
                              this.cartArray = [];
                }
    }
      
  async addToWishList()
    {
            //Adding to wishlist isin't working, same issue as register, server error 500,hence commented for now#
            if(this.colorArray.length > 0)
            {
                      if (this.productFields.color === '')
                      {
                        this.ToastService.presentToastMsg("Please Choose "+ this.attribute_head_one)
                        return;
                      }
                      else if(this.productFields.size === '' && this.sizeArray.length >0)
                      {
                        this.ToastService.presentToastMsg("Please Choose "+ this.attribute_head_two)
                        return;
                      }

                    for (var k = 0; k< this.product_details.attribute_children.length; k++)
                      {
                    
                        for (var j = 0; j< this.product_details.attribute_children[k].values.length; j++)
                        {
                        
                          if (this.productFields.color === this.product_details.attribute_children[k].values[j].name){

                            if(this.product_details.attribute_children[k].values[j].values[1] !== undefined)
                            {
                                
                                  for (var l = 0; l< this.product_details.attribute_children[k].values[j].values[1].values.length; l++)
                                  {
                                
                                    if (this.productFields.size === this.product_details.attribute_children[k].values[j].values[1].values[l].name){
                                      var childId  = this.product_details.attribute_children[k].values[j].values[1].values[l].child.product_id;
                                  


                                    }

                                  }
                            }else
                            {
                                if(this.product_details.attribute_children[k].values[j].child !== undefined)
                                {
                                    var childId  = this.product_details.attribute_children[k].values[j].child.product_id;
                                  
                                }

                            }

                          }

                        }
                      }
            }else if(this.colorArray.length == 0 && this.sizeArray.length >0)// need to delete later
            {
                      if(this.productFields.size === '')
                      {
                        this.ToastService.presentToastMsg("Please choose size")
                        return;
                      }
                      for (var k = 0; k< this.product_details.attribute_children.length; k++)
                      {
                      
                        for (var j = 0; j< this.product_details.attribute_children[k].values.length; j++)
                        {
                      
                          if (this.productFields.size.trim() === this.product_details.attribute_children[k].values[j].name.trim()){
          
                              
                              var childId  = this.product_details.attribute_children[k].values[j].child.product_id;
                        
          
                          }
          
                        }
                      }
            }else if ("child" in this.product_details.attribute_children)
            {
              
                            var childId =this.product_details.attribute_children.child.product_id;
                          
            }

          await this.AuthenticationService.getLoggedInStatus();
          if (this.AuthenticationService.userHasLogged)
          {
            var product_id:number = Number(childId);
            var quantity:number = 1;

            var extra = {
              "product_id":product_id,
              "quantity":quantity
            };
          
            this.dataService.sync_products.push(extra);
          
          this.LoadingService.showLoading();
            this.ApiConnectionService.post({url:'/mobile_app/v1/wish_list',postParams:{sync_products: JSON.stringify(this.dataService.sync_products)}}).then(data => {
              
                this.LoadingService.stopLoading(); 
                if (data !== undefined && data !='' && data != null){
                this.dataService.sync_products = [];
                this.ToastService.presentToastMsg('<ion-icon name="checkmark-outline"></ion-icon>  Added to Wishlist!','bottom', "big-toast", [{
                  text: 'Go to Wishlist',
                  cssClass: 'big-toast-button',
                  handler: () => {
                    this.dataService.towishlistpage();
                  }
                }])
                }
            });
          }
          else
          {
            
            this.AuthenticationService.userHasLogged = false
          }
    }

  async addToWishListSection() //Adding product to wishlist from product detail page after user login/register from product detail page
    {
          await this.dataService.sleep(1500);
          let el: HTMLElement = this.wishlistDivClick.nativeElement;
          el.click();
    }
  
  openCustom() 
    {
          this.menu.enable(true, 'product-detail'+this.prod_det_menu_dymic_no);
          this.menu.open('product-detail'+this.prod_det_menu_dymic_no);
          //The below code should no longer be reqd,need to check it later
          this.CartService.getCartData().then(async data => {
              if (data !== undefined){
                console.log('data undefined');
              //  this.itemsIncart = 
              }
              else {
                console.log('data is defined');
              }
            });
    }
  showproduct_details()
    {
          this.AuthenticationService.userHasLogged = true;
    }
  async share()
    {
          if (this.sharingDetails.enabled === true){
            let shareRet = await Share.share({
              title: this.sharingDetails.title,
              text: this.sharingDetails.text,
              url: this.sharingDetails.url,
              dialogTitle: 'Share with buddies'
              //check for image url if required along with the above,it also comes from the service
              });
          }
          else
          {
            //Disable the button here, or a toast maybe telling the user that sharing is disabled
          }
    }
    //when color option is selected , the corresponding sizes will be listed in size select box...
  loadsizeOptionfromColorOption()
    {
            this.sizeArray=[];
            this.sizeButtonTitle = 'Choose '+ this.attribute_head_two;
            this.productFields.size = '';
                    for (var k = 0; k< this.product_details.attribute_children.length; k++)
                    {
                  
                      for (var j = 0; j< this.product_details.attribute_children[k].values.length; j++)
                      {
                        
                        if (this.productFields.color === this.product_details.attribute_children[k].values[j].name){

                        

                          if(this.product_details.attribute_children[k].values[j].images.length >0 && this.product_details.attribute_children[k].values[j].images[0] !=null && this.product_details.attribute_children[k].values[j].images[0] !='')
                          {
                              this.productFields.image=String (this.ApiConnectionService.client_url+''+this.product_details.attribute_children[k].values[j].images[0]);
                          }else
                          {
                            this.productFields.image = String (this.permananent_product_images[0]);
                          }

                          if(this.product_details.attribute_children[k].values[j].values[1] !== undefined)
                          {
                              for (var l = 0; l< this.product_details.attribute_children[k].values[j].values[1].values.length; l++)
                              {
                            
                                  this.sizeArray.push(this.product_details.attribute_children[k].values[j].values[1].values[l].name) 
                                  if(l==0)
                                  {
                                    this.actualPrice=this.product_details.attribute_children[k].values[j].values[1].values[l].child.price_breaks[1].price;
                                    this.salePrice=this.product_details.attribute_children[k].values[j].values[1].values[l].child.price_breaks[1].sale_price;
                                    this.price_breaks_details=this.product_details.attribute_children[k].values[j].values[1].values[l].child.price_breaks;
                                    this.changeItemPrice();
                                  }

                              }
                          }else{
                                    if(this.product_details.attribute_children[k].values[j].child !== undefined)
                                    {
                                      this.actualPrice=this.product_details.attribute_children[k].values[j].child.price_breaks[1].price;
                                      this.salePrice=this.product_details.attribute_children[k].values[j].child.price_breaks[1].sale_price;
                                      this.price_breaks_details=this.product_details.attribute_children[k].values[j].child.price_breaks;
                                      this.product_details_code = this.product_details.attribute_children[k].values[j].child.code;
                                        this.changeItemPrice();

                                        this.outofstockerrflag=false;
                                        if(parseInt(this.product_details.attribute_children[k].values[j].child.stock) < 1)
                                        {
                                          this.outofstockerrflag=true;
                                        }
                                    }

                          }

                        }

                      }
                    }
    }
      
  changecolornimage(colorarray:any,cnt:any) //change from swatch image
    {     
      
          this.outofstockerrflag=false;         
          for(var k=0;k<this.colorswatchArray.length;k++)
          {
              if(k==cnt)
              {
                this.colorswatchArray[k].bordercss='border:solid 2px black;';
                this.colorButtonTitle =colorarray.name;
                this.productFields.color = colorarray.name;
                this.loadsizeOptionfromColorOption();
              }else
              {
                this.colorswatchArray[k].bordercss='border:solid 1px gray;';
              }
          }
          this.change_slide_image();
    }
  change_slide_image() //change from colour picker
    {
      
          this.isShown_sash=true;
            for (var i = 0; i < (this.product_details.attribute_children.length); i++){

            // if (this.product_details.attribute_children[i].name == 'Colour'){ // dont delete this code

                  for (var j = 0; j < (this.product_details.attribute_children[i].values.length); j++)
                  {
                      if(this.product_details.attribute_children[i].values[j].name === this.productFields.color)
                      {
                          this.product_images= [];
                          for (var k = 0; k < (this.product_details.attribute_children[i].values[j].images.length); k++)
                          {
                              this.product_images.push(this.option_settings.image_url_prefix+this.product_details.attribute_children[i].values[j].images[k]);
                          }
                          break;
                      }

                  }
              //}

          }
          if(this.product_images.length==0)
          {
            this.product_images=this.permananent_product_images;
          }
    }
  change_slide_image_and_slide_to_first_from_swatch_colour(colorarray:any,cnt:any)
    {
      this.changecolornimage(colorarray,cnt);
      this.slide_image_to_first();
    }
  slide_image_to_first()
    {
      this.slides.slideTo(0,200);
    }
  itemPriceSelection()
    {

          if(this.colorArray.length > 0)
          {
                  
                  for (var k = 0; k< this.product_details.attribute_children.length; k++)
                  {
                
                    for (var j = 0; j< this.product_details.attribute_children[k].values.length; j++)
                    {
                  
                      if (this.productFields.color === this.product_details.attribute_children[k].values[j].name){

                            
                            if(this.product_details.attribute_children[k].values[j].values[1] !== undefined)
                            {
                                  for (var l = 0; l< this.product_details.attribute_children[k].values[j].values[1].values.length; l++)
                                  {
                                  
                                      if (this.productFields.size.trim() === this.product_details.attribute_children[k].values[j].values[1].values[l].name.trim()){
                                        
                                        this.productFields.product_id = this.product_details.attribute_children[k].values[j].values[1].values[l].child.product_id;
                                        this.productFields.stock=this.product_details.attribute_children[k].values[j].values[1].values[l].child.stock;
                                        this.productFields.summary=this.product_details.attribute_children[k].values[j].values[1].values[l].child.summary;
                                        this.actualPrice=this.product_details.attribute_children[k].values[j].values[1].values[l].child.price_breaks[1].price;
                                        this.salePrice=this.product_details.attribute_children[k].values[j].values[1].values[l].child.price_breaks[1].sale_price;
                                        this.price_breaks_details=this.product_details.attribute_children[k].values[j].values[1].values[l].child.price_breaks;
                                        this.product_details_code = this.product_details.attribute_children[k].values[j].values[1].values[l].child.code;
                                        this.changeItemPrice();    
                                        
                                      }

                                  }
                            }else
                            {
                                  if(this.product_details.attribute_children[k].values[j].child !== undefined)
                                    {
                                      this.productFields.product_id = this.product_details.attribute_children[k].values[j].child.product_id;
                                        this.productFields.stock=this.product_details.attribute_children[k].values[j].child.stock;
                                        this.productFields.summary=this.product_details.attribute_children[k].values[j].child.summary;
                                        this.actualPrice=this.product_details.attribute_children[k].values[j].child.price_breaks[1].price;
                                        this.salePrice=this.product_details.attribute_children[k].values[j].child.price_breaks[1].sale_price;
                                        this.price_breaks_details=this.product_details.attribute_children[k].values[j].child.price_breaks;
                                        this.product_details_code = this.product_details.attribute_children[k].values[j].child.code;
                                        this.changeItemPrice();

                                        this.outofstockerrflag=false;
                                          if(parseInt(this.product_details.attribute_children[k].values[j].child.stock) < 1)
                                          {
                                            this.outofstockerrflag=true;
                                          }
                                    }
                            }

                      }

                    }
                  }
          }else if(this.colorArray.length == 0 && this.sizeArray.length >0)// need to delete later
          {
                  
                  for (var k = 0; k< this.product_details.attribute_children.length; k++)
                  {
                  
                    for (var j = 0; j< this.product_details.attribute_children[k].values.length; j++)
                    {
                  
                      if (this.productFields.size.trim() === this.product_details.attribute_children[k].values[j].name.trim()){

                            
                          this.productFields.product_id = this.product_details.attribute_children[k].values[j].child.product_id;
                          this.productFields.stock=this.product_details.attribute_children[k].values[j].child.stock;
                          this.productFields.summary=this.product_details.attribute_children[k].values[j].child.summary;
                          this.actualPrice=this.product_details.attribute_children[k].values[j].child.price_breaks[1].price;
                          this.salePrice=this.product_details.attribute_children[k].values[j].child.price_breaks[1].sale_price;
                          this.price_breaks_details=this.product_details.attribute_children[k].values[j].child.price_breaks;
                          this.product_details_code = this.product_details.attribute_children[k].values[j].child.code;
                          this.changeItemPrice();    
                        

                      

                      }

                    }
                  }
          }else if ("child" in this.product_details.attribute_children)
          {
          
                        this.productFields.product_id =this.product_details.attribute_children.child.product_id;
                        this.productFields.stock=this.product_details.attribute_children.child.stock;
                        this.productFields.summary=this.product_details.attribute_children.child.summary;
                        this.actualPrice=this.product_details.attribute_children.child.price_breaks[1].price;
                        this.salePrice=this.product_details.attribute_children.child.price_breaks[1].sale_price;
                        this.price_breaks_details=this.product_details.attribute_children.child.price_breaks;
                        this.changeItemPrice();

          }
    }
  changeItemPrice()
    {
          if(this.salePrice !== undefined)
            {
              this.productFields.price = this.salePrice;
            }
            else
            {
              this.productFields.price = this.actualPrice;
            }

            this.price_breaks_count=this.dataService.objectLength(this.price_breaks_details);
            this.productFields.price_breaks_details =this.price_breaks_details;
            this.productFields.price_breaks_count =this.price_breaks_count;


    }
  extra_info_popup_open()
    {
          this.openWithInAppBrowser(this.size_extra_info.link);
      
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
  toSearchPage()
    {
          if(this.searchValue.trim() !='' && this.searchValue != undefined && this.searchValue != null)
          {
            this.dataService.globalSearch=this.searchValue;  
            this.searchValue='';
            let randno:number =this.dataService.getRandomInt(20001,30000); 
            this.nav.navigateForward( this.dataService.tab_menu_path+'/search/'+randno);
          }else{
            this.searchValue='';
            this.dataService.globalSearch='';
          }
    }
  show_hide_sash()
    {
          //const slider_det = await this.slides.getSwiper();
          //console.log(slider_det.zoom);// do not delete
          this.isShown_sash = ! this.isShown_sash;
    }
}
