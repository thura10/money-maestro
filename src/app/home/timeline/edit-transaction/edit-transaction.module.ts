import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTransactionPageRoutingModule } from './edit-transaction-routing.module';

import { EditTransactionPage } from './edit-transaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTransactionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditTransactionPage]
})
export class EditTransactionPageModule {}
