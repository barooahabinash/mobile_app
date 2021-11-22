import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { MainmenuPageRoutingModule } from './mainmenu-routing.module';

import { MainmenuPage } from './mainmenu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainmenuPageRoutingModule
  ],
  declarations: [MainmenuPage,ConnectionCheckComponent]
})
export class MainmenuPageModule {}
