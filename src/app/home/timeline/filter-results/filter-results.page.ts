import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

import { trigger, style, animate, transition } from '@angular/animations';

import { Pipe, PipeTransform } from '@angular/core';
import { TransactionDetailsPage } from '../transaction-details/transaction-details.page';
import { EditTransactionPage } from '../edit-transaction/edit-transaction.page';
import { UserService } from 'src/app/user.service';
@Pipe({name: 'amountPipe'})
export class AmountPipe implements PipeTransform {
  transform(amount: number): string {
    return sessionStorage.getItem('currency') + " " + Math.abs(amount)
  }
}

@Component({
  selector: 'app-filter-results',
  templateUrl: './filter-results.page.html',
  styleUrls: ['./filter-results.page.scss'],
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
export class FilterResultsPage implements OnInit {

  @Input() transactions: any[];
  @Input() currency: string;
  @Input() uid: string;
  @Input() previousPage: string;

  constructor(private modal: ModalController, private modalController: ModalController, private toastController: ToastController, private userService: UserService) { }

  ngOnInit() {
  }
  dismiss() {
    this.modal.dismiss();
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
    modal.onWillDismiss().then(res => {
      if (res.data && res.data.edit) {
        this.transactions.splice(index, 1, res.data.data)
      }
    })
  }
  async editTransaction(transaction: any, index: number) {
    const modal = await this.modalController.create({
      component: EditTransactionPage,
      componentProps: {
        transaction: transaction,
        currency: this.currency,
        uid: this.uid,
      }
    })
    await modal.present();
    modal.onWillDismiss().then(res => {
      if (res.data && res.data.edit) {
        this.transactions.splice(index, 1, res.data.data);
      }
    })
  }


}
