import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditTransactionPage } from '../edit-transaction/edit-transaction.page';
import { FilterResultsPage } from '../filter-results/filter-results.page';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})

export class TransactionDetailsPage implements OnInit {

  @Input() transaction: any;
  @Input() currency: string;
  @Input() uid: string;

  edited: boolean;
  selectedCategory: any;

  categories = [
    {
      name: 'Entertainment',
      icon: 'videocam-outline',
      color: 'crimson'
    },
    {
      name: 'Food',
      icon: 'restaurant-outline',
      color: 'chocolate'
    },
    {
      name: 'Travel',
      icon: 'train-outline',
      color: 'teal'
    },
    {
      name: 'Groceries',
      icon: 'basket-outline',
      color: 'mediumseagreen'
    },
    {
      name: 'Shopping',
      icon: 'pricetag-outline',
      color: 'darkslateblue'
    },
    {
      name: 'Others',
      icon: 'grid-outline',
      color: 'burlywood'
    },
  ]

  constructor(private modal: ModalController, private modalController: ModalController, private userService: UserService) { }
  
  ngOnInit() {
    this.selectedCategory = this.getCategory(this.transaction.category)[0];
  }
  dismiss() {
    this.modal.dismiss({
      edit: this.edited,
      data: this.transaction
    });
  }

  getAmount(amount: number) {
    return this.currency + " " + Math.abs(amount)
  }
  getMonth(month: number) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return monthNames[month-1];
  }
  getCategory(name: string) {
    return this.categories.filter((category) => {
      return category.name === name
    })
  }

  async editTransaction() {
    const editModal = await this.modalController.create({
      component: EditTransactionPage,
      componentProps: {
        transaction: this.transaction,
        currency: this.currency,
        uid: this.uid,
      }
    })
    await editModal.present();
    editModal.onWillDismiss()
    .then(res => {
      if (res.data.edit) {
        this.edited = res.data.edit;
        this.transaction = res.data.data,
        this.ngOnInit();
      }
    })
  }

  filterCategory(category: string) {
    this.userService.getFilteredTransactions(this.uid).where('category', '==', category).get()
    .then(res => {
      const data = res.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));
      this.filterResults(data);
    })
  }

  filterTag(tag: string) {
    this.userService.getFilteredTransactions(this.uid).where('tags', 'array-contains', tag).get()
    .then(res => {
      const data = res.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));
      this.filterResults(data);
    })
  }

  async filterResults(data: any[]) {
    const modal = await this.modalController.create({
      component: FilterResultsPage,
      componentProps: {
        currency: this.currency,
        uid: this.uid,
        previousPage: 'Transaction',
        transactions: data,
      }
    })
    await modal.present();
  }

}
