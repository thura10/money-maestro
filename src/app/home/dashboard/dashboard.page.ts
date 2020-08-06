import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';

import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FilterResultsPage } from '../timeline/filter-results/filter-results.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  transactions: any[];
  length = new FormControl("week");

  uid: string;
  listener: () => void = () => {};

  pieData: any;
  barData: number;
  lineData: any;

  monthData: any[] = [];
  months: any[];

  currency: string;
  budget: number;
  budgetPerMonth: number;

  constructor(private userService: UserService, private modalController: ModalController) { }

  ionViewWillEnter() {
    if (this.pieData) {
      this.processData();
    }
    if (this.lineData) {
      this.processLineData();
    }
  }

  ngOnInit() {
    this.userService.checkLoggedIn().subscribe(res => {
      if (!res) return;
      this.uid = res.uid;
      this.userService.getUserPrefs(this.uid).subscribe(res => {
        this.currency = res.data().currency;
        this.budgetPerMonth = res.data().budget;
        this.budget = this.budgetPerMonth/4;
      })
      
      this.refreshData();
      this.length.valueChanges.subscribe(e => {
        this.refreshData(false);
        switch (this.length.value) {
          case 'week':
            this.budget = this.budgetPerMonth/4;
            break;
          case 'month':
            this.budget = this.budgetPerMonth;
            break;
          case 'year':
            this.budget = this.budgetPerMonth * 12;
            break;
        }
      })
    })
  }

  refreshData(event?) {
    this.listener();
    //get data for pie chart and bar
    this.listener = this.userService.getDashboardData(this.uid, this.length.value).onSnapshot((res) => {
      let length = this.length.value;
      this.transactions = res.docs.map(doc => doc.data());
      this.processData();
      if (event) event.target.complete();
       //get data for line graph
      if (event !== false) this.getLineData();
    })
  }
  processData() {
    this.pieData = {Entertainment: 0, Food: 0, Travel: 0, Groceries: 0, Shopping: 0, Others: 0};
    this.barData = 0;

    for (let transaction of this.transactions) {
      this.pieData[transaction.category] += transaction.amount;
      this.barData += transaction.amount;
    }
    this.barData = Math.abs(this.barData);
    for (let category in this.pieData) {
      this.pieData[category] = Math.abs(this.pieData[category]);
    }
  }

  async getLineData() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;

    let months: any[] = [];
    for (let i=0; i<6; i++) {
      months.push({
        month: month,
        year: year
      });
      month -= 1;
      if (month === 0) {
        year -= 1; 
        month = 12;
      }
    }
    this.months = months;

    let promises = [];
    for (let obj of months) { 
      promises.push(
        this.userService.getDataByMonthYear(this.uid, obj.month, obj.year)
      )
    }
    //when all promises are resolved, push data into array
    this.monthData = [];
    Promise.all(promises)
    .then((results) => {
      if (this.monthData.length) return;
      for (let result of results) {
        result.docs.map(doc => doc.data()).forEach(data => {
          this.monthData.push(data);
        })
      }
      this.processLineData()
    })
  }
  processLineData() {
    this.lineData = {}
    for (let month of this.months) {
      this.lineData = Object.assign(this.lineData, {[month.month]: 0})
    }
    for (let transaction of this.monthData) {
      this.lineData[transaction.month] += transaction.amount;
    }
  }

  async filterCategory(category) {
    const modal = await this.modalController.create({
      component: FilterResultsPage,
      componentProps: {
        transactions: this.transactions.filter((doc) => doc.category === category),
        currency: this.currency,
        uid: this.uid,
        previousPage: 'Dashboard'
      }
    })
    await modal.present();
  }
}

