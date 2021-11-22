import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmenuonePage } from './submenuone.page';

const routes: Routes = [
  {
    path: '',
    component: SubmenuonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmenuonePageRoutingModule {}
