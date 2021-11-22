import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
  ],
  declarations: [SearchPage,ConnectionCheckComponent]
})
export class SearchPageModule {}
