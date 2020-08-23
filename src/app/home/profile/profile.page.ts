import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { EditProfilePage } from './edit-profile/edit-profile.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private userService: UserService, private router: Router, private alertController: AlertController, private modalController: ModalController, private toastController: ToastController) { }
  
  uid: string;
  email: string;

  firstName: string;
  dark: boolean;
  push:boolean = true;
  currency: string;
  budget: number = 0;

  facebookLinked: boolean;
  providerLength: number;

  darkToggle = new FormControl(this.dark);
  pushToggle = new FormControl();

  ngOnInit() {
    this.currency = sessionStorage.getItem('currency');

    this.userService.getFbResult()
    .then(async (res) => {
      if (res.user) {
        const toast = await this.toastController.create({
          message: 'Account Linked',
          duration: 4000
        })
        toast.present();
      }
    })
    .catch(async (err) => {
      console.log(err);
      const toast = await this.toastController.create({
        message: err.message,
        duration: 4000
      })
      toast.present();
    })

    this.userService.checkLoggedIn().subscribe(res => {
      if (!res) return;
      for (let provider of res.providerData) {
        if (provider.providerId == 'facebook.com') {
          this.facebookLinked = true;
        }
      }
      this.providerLength = res.providerData.length;

      this.uid = res.uid;
      this.email = res.email;
      this.userService.getUserPrefs(this.uid).subscribe(res => {
        this.firstName = res.data().firstName;
        this.currency = res.data().currency;
        this.budget = res.data().budget;
        sessionStorage.setItem('currency', this.currency);
      })
    })

    const prefersColor = window.matchMedia('(prefers-color-scheme: dark)');    
    if (localStorage.getItem('dark')) {
      let dark = (localStorage.getItem('dark') === 'true');
      this.dark = dark;
    }
    else {
      this.dark = prefersColor.matches;
    }
    this.updateDarkMode();

    this.darkToggle.setValue(this.dark);

    if (localStorage.getItem('push') !== 'false') {
      this.pushToggle.setValue(true);
    }
    else {this.push = false}
  }
  
  changeDarkMode() {
    this.dark = !this.darkToggle.value;
    this.darkToggle.setValue(this.dark);
    this.updateDarkMode();
  }
  updateDarkMode() {
    document.body.classList.toggle('dark', this.dark);
    if (localStorage.getItem('dark') == this.dark.toString()) {
      localStorage.removeItem('dark');
    }
    else {
      localStorage.setItem('dark', this.dark.toString());
    }
  }

  changePush() {
    this.push = !this.push;
    this.pushToggle.setValue(this.push);
    if (this.push) {
      localStorage.removeItem("push");
    }
    else {
      localStorage.setItem("push", "false");
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      subHeader: 'Logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Okay',
          handler: () => {
            this.userService.logout()
            .then(res => {
              this.router.navigateByUrl('/landing')
            })
            .catch(err => {
              console.log(err);
            })
          }
        }
      ]
    });
    await alert.present();
  }

  async chooseCurrency() {
    const labels = ["US Dollar $", "Euro €", "Pound Sterling £", "Yen / Renmibi ‎¥", "Singapore Dollar S$", "Swiss Franc Fr."];
    const values = ["$", "€", "£", "¥", "S$", "Fr."];
    const inputs = [];

    for (let i=0; i<values.length; i++) {
      if (values[i] == this.currency) inputs.push({type: 'radio', label: labels[i], value: values[i], checked: true});
      else inputs.push({type: 'radio', label: labels[i], value: values[i]});
    }
    const alert = await this.alertController.create({
      cssClass: 'alert-currency-dialog',
      header: 'Choose your preferred currency',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Save',
          handler: (value: string) => {
            sessionStorage.setItem("currency", value);
            this.currency = value;
            this.userService.setUserPrefs(this.uid, {"currency": value})
            .then(res => {
              return
            })
            .catch(err => {
              console.log(err);
            })
          }
        }
      ]
    });
    await alert.present();
  }

  async changeBudget() {
    const alert = await this.alertController.create({
      header: "Enter your budget for a month",
      inputs: [{
        name: 'budget',
        type: 'number',
        placeholder: "Budget",
        value: this.budget
      }],
      buttons: [
        {
          role: 'cancel',
          text: 'Cancel'
        }, {
          text: 'Save',
          handler: (data) => {
            this.userService.setBudget(this.uid, data.budget)
            .then(res => {
              this.budget = data.budget
            })
            .catch(err => console.log(err));
          }
        }
      ]
    })
    await alert.present();
  }

  async sendFeedback() {
    const alert = await this.alertController.create({
      cssClass: 'alert-feedback-dialog',
      header: "Send Feedback",
      inputs: [{
        name: 'feedback',
        type: 'textarea',
        placeholder: "Any feedback is appreciated",
      }],
      buttons: [
        {
          role: 'cancel',
          text: 'Cancel'
        }, {
          text: 'Send',
          handler: (data) => {
            this.userService.sendFeedback({"uid": this.uid, "feedback": data.feedback})
            .then(res => {
              return
            })
            .catch(err => {
              console.log(err);
            })
          }
        }
      ]
    });
    await alert.present();
  }

  async editProfile() {
    const modal =  await this.modalController.create({
      component: EditProfilePage,
      componentProps: {
        uid: this.uid,
        email: this.email,
        facebookLinked: this.facebookLinked,
        providerLength: this.providerLength
      }
    })
    await modal.present();

    const data = await modal.onWillDismiss();
    if (data.data.edit) {
      this.ngOnInit();
    }
  }

}
