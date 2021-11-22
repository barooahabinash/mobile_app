import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './../../components/cart/cart.component';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { IonicModule } from '@ionic/angular';

import { ShopPageRoutingModule } from './shop-routing.module';

import { ShopPage } from './shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopPageRoutingModule,
  ],
  declarations: [ShopPage,CartComponent,ConnectionCheckComponent]
})
export class ShopPageModule {}
