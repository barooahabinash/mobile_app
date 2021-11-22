import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { LoginRegistrationComponent } from 'src/app/components/login-registration/login-registration.component';
import { IonicModule } from '@ionic/angular';

import { LinksPageRoutingModule } from './links-routing.module';

import { LinksPage } from './links.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LinksPageRoutingModule
  ],
  declarations: [LinksPage,ConnectionCheckComponent,LoginRegistrationComponent]
})
export class LinksPageModule {}
