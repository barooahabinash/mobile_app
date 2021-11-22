import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { MorePageRoutingModule } from './more-routing.module';

import { MorePage } from './more.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MorePageRoutingModule
  ],
  declarations: [MorePage,ConnectionCheckComponent]
})
export class MorePageModule {}
