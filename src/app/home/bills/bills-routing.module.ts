import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillsPage } from './bills.page';

const routes: Routes = [
  {
    path: '',
    component: BillsPage
  },
  {
    path: 'add-bill',
    loadChildren: () => import('./add-bill/add-bill.module').then( m => m.AddBillPageModule)
  },
  {
    path: 'edit-bill',
    loadChildren: () => import('./edit-bill/edit-bill.module').then( m => m.EditBillPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsPageRoutingModule {}
