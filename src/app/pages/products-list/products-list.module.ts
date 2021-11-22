import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './../../components/cart/cart.component';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';


import { IonicModule } from '@ionic/angular';

import { ProductsListPageRoutingModule } from './products-list-routing.module';

import { ProductsListPage } from './products-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsListPageRoutingModule,
  ],
  declarations: [ProductsListPage,CartComponent,ConnectionCheckComponent]
})
export class ProductsListPageModule {}
