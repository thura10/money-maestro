import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBillPageRoutingModule } from './add-bill-routing.module';

import { AddBillPage } from './add-bill.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBillPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddBillPage]
})
export class AddBillPageModule {}
