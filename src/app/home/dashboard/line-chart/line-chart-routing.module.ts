import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LineChartPage } from './line-chart.page';

const routes: Routes = [
  {
    path: '',
    component: LineChartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LineChartPageRoutingModule {}
