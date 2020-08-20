import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBillPage } from './add-bill.page';

const routes: Routes = [
  {
    path: '',
    component: AddBillPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBillPageRoutingModule {}
