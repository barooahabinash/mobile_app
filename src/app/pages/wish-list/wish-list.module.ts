import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './../../components/cart/cart.component';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { LoginRegistrationComponent } from 'src/app/components/login-registration/login-registration.component';
import { IonicModule } from '@ionic/angular';

import { WishListPageRoutingModule } from './wish-list-routing.module';

import { WishListPage } from './wish-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WishListPageRoutingModule,
  ],
  declarations: [WishListPage,CartComponent,ConnectionCheckComponent,LoginRegistrationComponent]
})
export class WishListPageModule {}
