import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { ModalController, ToastController } from '@ionic/angular';

import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';
import { TransactionDetailsPage } from './transaction-details/transaction-details.page';
import { EditTransactionPage } from './edit-transaction/edit-transaction.page';
import { FilterPage } from './filter/filter.page';
import { FilterResultsPage } from './filter-results/filter-results.page';


import { trigger, style, animate, transition } from '@angular/animations';

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'amountPipe'})
export class AmountPipe implements PipeTransform {
  transform(amount: number): string {
    return sessionStorage.getItem('currency') + " " + Math.abs(amount)
  }
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'translate3d(-100%, 0, 0)', opacity: 0.5 }),  // initial
        animate('{{duration}}ms ease', 
        style({ transform: 'translate3d(0, 0, 0)', opacity: 1 }))  // final
      ])
    ])
  ]
})
export class TimelinePage implements OnInit {

  uid: string;
  
  currency: string;
  transactions: any[];

  day: number;
  month: number;
  year: number;

  selectedDate = new Date();
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  constructor(private userService: UserService, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.day = this.selectedDate.getDate();
    this.month = this.selectedDate.getMonth() + 1;
    this.year = this.selectedDate.getFullYear();
    this.updateData();
  }

  updateData(event?) {
    this.transactions = null;
    this.currency = sessionStorage.getItem('currency');
    this.userService.checkLoggedIn().subscribe(res => {
      this.uid = res.uid;
      this.userService.getAllTransactionByDate(this.uid, this.day, this.month, this.year).onSnapshot((res) => {
        this.transactions = res.docs.map((doc) => Object.assign(doc.data(), {id: doc.id}));
        if (event) event.target.complete();
      })
    })
  }

  async changeDate() {
    const options = {
      inputDate: this.selectedDate,
      showTodayButton: false,
      setLabel: 'Ok',
      closeLabel: 'Cancel', 
      titleLabel: 'Select a Date',
      monthsList: this.monthNames,
      btnProperties: {
        fill: 'clear'
      },
    };
    const datePickerModal = await this.modalController.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { 
         'objConfig': options, 
         'selectedDate': this.selectedDate 
      }
    });
    await datePickerModal.present();

    datePickerModal.onDidDismiss()
    .then(res => {
      if (res.data && res.data.date != "Invalid date") {
        this.selectedDate = new Date(res.data.date);
        this.ngOnInit();
      }  
    })
  }

  deleteSlide(transaction: any, index: number, event?) {
    let slider = event.target.previousElementSibling;
    let delBtn = event.target.children[1];
    this.deleteTransaction(transaction, index, slider, delBtn);
  }
  deleteBtn(transaction: any, index: number, event?) {
    let slider = event.target.parentElement.previousElementSibling;
    let delBtn = event.target;
    this.deleteTransaction(transaction, index, slider, delBtn);
  }

  async deleteTransaction(transaction: any, index: number, slider, delBtn) {
    //make delete button fill screen
    slider.classList.add('deleting');
    delBtn.classList.add('deleting');
    setTimeout(() => delBtn.classList.add('deleted'), 300);
    setTimeout(() => this.transactions.splice(index, 1), 600)

    const toast = await this.toastController.create({
      color: 'light',
      duration: 5000,
      message: "Transaction deleted",
      buttons: [{
        role: 'cancel',
        text: 'Undo',
        handler: () => {
          this.transactions.splice(index, 0, Object.assign(transaction, {'animate': true}));
        }
      }]
    })
    await toast.present();
    toast.onDidDismiss()
    .then(res => {
      if (res.role != 'cancel') {
        this.userService.deleteTransaction(this.uid, transaction.id)
        .then(res => {
          return;
        })
        .catch(err => {
          console.log(err);
        })
      }
    })
  }

  async showTransactionDetails(transaction: any, index: number) {
    const modal = await this.modalController.create({
      component: TransactionDetailsPage,
      swipeToClose: true,
      componentProps: {
        transaction: transaction,
        currency: this.currency,
        uid: this.uid,
      }
    })
    await modal.present();
  }
  async editTransaction(transaction: any) {
    const modal = await this.modalController.create({
      component: EditTransactionPage,
      componentProps: {
        transaction: transaction,
        currency: this.currency,
        uid: this.uid,
      }
    })
    await modal.present();
  }

  async filter() {
    const modal = await this.modalController.create({
      component: FilterPage,
      componentProps: {
        currency: this.currency,
        uid: this.uid,
      }
    })
    await modal.present();

    modal.onWillDismiss().then(res => {
      if (res.data && res.data.result) {
        this.filterResults(res.data.data);
      }
    })
  }

  async filterResults(data: any) {
    const modal = await this.modalController.create({
      component: FilterResultsPage,
      componentProps: {
        currency: this.currency,
        uid: this.uid,
        transactions: data,
        previousPage: 'Timeline'
      }
    })
    await modal.present();
  }

}
