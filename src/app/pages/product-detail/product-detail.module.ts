import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './../../components/cart/cart.component';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { LoginRegistrationComponent } from 'src/app/components/login-registration/login-registration.component';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailPageRoutingModule,
  ],
  declarations: [ProductDetailPage,CartComponent,ConnectionCheckComponent,LoginRegistrationComponent]
})
export class ProductDetailPageModule {}
