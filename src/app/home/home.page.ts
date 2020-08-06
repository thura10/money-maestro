import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddTransactionPage } from './add-transaction/add-transaction.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  uid: string;
  currency: string;

  constructor(private userService: UserService, private router: Router, private modalController: ModalController) { }

  ngOnInit() {
    this.userService.checkLoggedIn().subscribe(result => {
      if(!result) {
        this.router.navigateByUrl('/landing')
        return;
      }
      this.uid = result.uid;
      this.userService.getUserPrefs(this.uid).subscribe(res => {
        sessionStorage.setItem('currency', res.data().currency);
        this.currency = res.data().currency
      })
    })
    
    const prefersColor = window.matchMedia('(prefers-color-scheme: dark)');
    if (localStorage.getItem('dark')) {
      let dark = (localStorage.getItem('dark') === 'true');
      document.body.classList.toggle('dark', dark);
    }
    else {
      document.body.classList.toggle('dark', prefersColor.matches);
    }
  }

  async addTransaction() {
    const modal = await this.modalController.create({
      component: AddTransactionPage,
      componentProps: {
        uid: this.uid,
        currency: this.currency
      }
    });
    await modal.present();

    const data = await modal.onWillDismiss();
    if (data.data.add) {
      //data changed. refresh
    }
  }

}
