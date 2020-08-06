import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { PieChartPage } from './pie-chart/pie-chart.page';
import { BarPage } from './bar/bar.page';
import { LineChartPage } from './line-chart/line-chart.page';

import { ChartModule } from 'angular2-chartjs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    ReactiveFormsModule,
    ChartModule
  ],
  declarations: [
    DashboardPage,
    PieChartPage,
    BarPage,
    LineChartPage
  ]
})
export class DashboardPageModule {}
