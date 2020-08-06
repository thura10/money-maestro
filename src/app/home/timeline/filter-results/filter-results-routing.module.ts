import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterResultsPage } from './filter-results.page';

const routes: Routes = [
  {
    path: '',
    component: FilterResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterResultsPageRoutingModule {}
