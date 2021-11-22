import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ConnectionCheckComponent } from 'src/app/components/connection-check/connection-check.component';
import { FiltersPageRoutingModule } from './filters-routing.module';

import { FiltersPage } from './filters.page';
import { FilterSectionComponent } from 'src/app/components/filter-section/filter-section/filter-section.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltersPageRoutingModule
  ],
  declarations: [
    FiltersPage,
    FilterSectionComponent,
    ConnectionCheckComponent
  ]
})
export class FiltersPageModule {}
