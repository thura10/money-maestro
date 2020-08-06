import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimelinePageRoutingModule } from './timeline-routing.module';
import { TimelinePage, AmountPipe } from './timeline.page';

import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { TransactionDetailsPageModule } from './transaction-details/transaction-details.module';
import { EditTransactionPageModule } from './edit-transaction/edit-transaction.module';
import { FilterPageModule } from './filter/filter.module';
import { FilterResultsPageModule } from './filter-results/filter-results.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimelinePageRoutingModule,
    Ionic4DatepickerModule,
    TransactionDetailsPageModule,
    EditTransactionPageModule,
    FilterPageModule,
    FilterResultsPageModule
  ],
  declarations: [
    TimelinePage,
    AmountPipe
  ],
})
export class TimelinePageModule {}
