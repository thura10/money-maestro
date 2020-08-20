import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { ModalController, ToastController, ActionSheetController, Platform } from '@ionic/angular';
import { AddBillPage } from './add-bill/add-bill.page';
import { EditBillPage } from './edit-bill/edit-bill.page';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx'

import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.page.html',
  styleUrls: ['./bills.page.scss'],
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
export class BillsPage implements OnInit {

  currency: string;
  uid: string;

  done: boolean;

  bills: any[];
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  constructor(private userService: UserService, private modalController: ModalController, private toastController: ToastController, private actionSheetController: ActionSheetController, private localNotifications: LocalNotifications, private platform: Platform) { }

  ngOnInit() {
    this.userService.checkLoggedIn().subscribe(res => {
      this.uid = res.uid;
      this.currency = sessionStorage.getItem('currency');
      if (!this.currency) {
        this.userService.getUserPrefs(this.uid).subscribe(res => {
          this.currency = res.data().currency
        })
      }
      this.getBills();
    })
  }
  ionViewDidEnter() {
    this.done = false;
  }

  async addBill() {
    const modal = await this.modalController.create({
      component: AddBillPage,
      componentProps: {
        currency: this.currency, 
        uid: this.uid
      }
    })
    await modal.present();
    modal.onWillDismiss().then(res => {
      if (res.data.add) {
        this.getBills();
      }
    })
  }

  getBills(event?) {
    this.userService.getBills(this.uid).get()
    .then((res) => {
      this.bills = res.docs.map(doc => Object.assign(doc.data(), {id: doc.id})) 
      if (event) event.target.complete();
      this.scheduleNotifications();
    })
    .catch(err => {
      console.log(err);
    })
  }
  getBillLabel(bill: any) {
    if (bill.recurring) return `Recurring on the ${bill.date[0]}th`
    return `${bill.date[0]} ${this.monthNames[bill.date[1]-1]} ${bill.date[2]}`
  }
  checkDueDate(bill: any) {
    if (bill.recurring) {
      if (bill.date[0] === new Date().getUTCDate()) return true;
      return false;
    }
    let today = new Date()
    if (bill.date[0] == today.getDate() && bill.date[1]-1 == today.getMonth() && bill.date[2] == today.getFullYear()) return true;
    return false
  }
  checkPaid(bill: any) {
    if (!bill.recurring) {
      const today = new Date();
      today.setHours(12,0,0,0);
      const due = new Date(bill.date[2], bill.date[1]-1, bill.date[0]);
      due.setHours(12,0,0,0);

      if ((today.valueOf() - due.valueOf()) > 0) return true;
      return false;
    }
    return false
  }

  async billOptions(bill: any, index: number, event?) {
    const alert = await this.actionSheetController.create({
      header: 'Modify Bill',
      buttons: [{
        text: 'Edit Bill',
        handler: () => {
          this.editBill(bill, index);
        }
      }, {
        text: 'Delete Bill',
        handler: () => {
          const slider = event.target;
          const delBtn = event.target.nextElementSibling.children[1];
          
          const item = event.target.parentElement;
          item.classList.add('item-sliding-active-slide', 'item-sliding-active-options-end')

          this.deleteBill(bill, index, slider, delBtn)
        }
      }]
    });
    alert.present();
  }

  deleteSlide(bill: any, index: number, event?) {
    let slider = event.target.previousElementSibling;
    let delBtn = event.target.children[1];
    this.deleteBill(bill, index, slider, delBtn);
  }
  deleteBtn(bill: any, index: number, event?) {
    let slider = event.target.parentElement.previousElementSibling;
    let delBtn = event.target;
    this.deleteBill(bill, index, slider, delBtn);
  }

  async deleteBill(bill: any, index: number, slider, delBtn) {
    //make delete button fill screen
    slider.classList.add('deleting');
    delBtn.classList.add('deleting');
    setTimeout(() => delBtn.classList.add('deleted'), 300);
    setTimeout(() => this.bills.splice(index, 1), 600)

    const toast = await this.toastController.create({
      color: 'light',
      duration: 5000,
      message: "Transaction deleted",
      buttons: [{
        role: 'cancel',
        text: 'Undo',
        handler: () => {
          this.bills.splice(index, 0, Object.assign(bill, {'animate': true}));
        }
      }]
    })
    await toast.present();
    toast.onDidDismiss()
    .then(res => {
      if (res.role != 'cancel') {
        this.userService.deleteBill(this.uid, bill.id)
        .then(res => {
          return;
        })
        .catch(err => {
          console.log(err);
        })
      }
    })
  }

  async editBill(bill: any, index: number) {
    const modal = await this.modalController.create({
      component: EditBillPage,
      componentProps: {
        currency: this.currency, 
        uid: this.uid,
        bill: bill
      }
    })
    await modal.present();
    modal.onWillDismiss().then(res => {
      if (res.data.edit) {
        this.getBills();
      }
    })
  }

  scheduleNotifications() {
    if (this.done) return;
    if (localStorage.getItem("push") === 'false') return;
    
    let bills = this.bills.filter((bill) => {return !this.checkPaid(bill)})

    let notifications: any[] = []
    for (let i=0; i<bills.length; i++) {

      notifications.push({
        id: i+1,
        title: `Your bill for ${bills[i].name} is due today`,
        text: `-${this.currency} ${bills[i].amount}`,
        vibrate: true,
        sound: true,
        launch: true,
        lockscreen: true,
        trigger:{at: this.getNotificationDate(bills[i])}
      })
    }
    console.log(notifications);
    this.localNotifications.cancelAll().then(() => {
      this.localNotifications.schedule(notifications);
      this.done = true;
    })
  }
  
  private getNotificationDate(bill: any) {
    //if recurring, check if the due date is past for this month.
    let date = bill.date;
    let recurring = bill.recurring;
    if (recurring) {
      const today = new Date();
      today.setHours(12,0,0,0);
      const due = new Date(date[2], date[1]-1, date[0]);
      due.setHours(12,0,0,0);

      let month = date[1];
      if ((today.valueOf() - due.valueOf()) <= 0) month = date[1]-1;
      console.log(today.valueOf() - due.valueOf(), month);

      let day = date[0];
      let lastDayOfMonth = new Date(today.getFullYear(), month+1, 0).getDate();
      //if the date is higher than the last day of month, send a notification on the last date instead.
      if (day > lastDayOfMonth) {
        day = lastDayOfMonth;
      }
      return new Date(date[2], month, day, 12,0,0,0);
    }
    return new Date(date[2], date[1]-1, date[0], 12, 0, 0, 0);
  }

}
