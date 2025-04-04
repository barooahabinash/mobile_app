import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { IonicModule } from '@ionic/angular';

import { AddressBookPageRoutingModule } from './address-book-routing.module';

import { AddressBookPage } from './address-book.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressBookPageRoutingModule
  ],
  declarations: [AddressBookPage,ConnectionCheckComponent]
})
export class AddressBookPageModule {}
