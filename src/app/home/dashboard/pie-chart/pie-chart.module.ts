import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PieChartPageRoutingModule } from './pie-chart-routing.module';

import { PieChartPage } from './pie-chart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PieChartPageRoutingModule
  ],
  declarations: [PieChartPage]
})
export class PieChartPageModule {}
