import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { SubmenuonePageRoutingModule } from './submenuone-routing.module';

import { SubmenuonePage } from './submenuone.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmenuonePageRoutingModule
  ],
  declarations: [SubmenuonePage,ConnectionCheckComponent]
})
export class SubmenuonePageModule {}
