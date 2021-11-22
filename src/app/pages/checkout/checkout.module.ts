import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { LoginRegistrationComponent } from 'src/app/components/login-registration/login-registration.component';
import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { CheckoutPage } from './checkout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule
  ],
  declarations: [CheckoutPage,ConnectionCheckComponent,LoginRegistrationComponent]
})
export class CheckoutPageModule {}
