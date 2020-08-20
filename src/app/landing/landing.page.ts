import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private userService: UserService, private router: Router, private toastController: ToastController) { }

  ngOnInit() {
    this.userService.getFbResult()
    .then(res => {
      if (res.user && res.additionalUserInfo.isNewUser) {
        this.userService.setUserDetails(res.user.uid, {
          firstName: res.additionalUserInfo.profile['first_name'],
          lastName: res.additionalUserInfo.profile['last_name'],
          dateOfBirth: res.additionalUserInfo.profile['birthday'],
          budget: 4000,
          currency: '$'
        })
        .then(res => {
          this.router.navigateByUrl('/')
        })
        .catch(err => {
          this.router.navigateByUrl('/')
          console.log(err);
        })
      }
      else {
        this.userService.checkLoggedIn().subscribe(res => {
          if (res) {
            this.router.navigateByUrl('/')
          }
        })
      }
    })
    .catch(async (error) => {
      console.log(error);
      const toast = await this.toastController.create({
        message: error.message,
        duration: 4000
      })
      toast.present();
    });

  }

  fbLogin() {
    this.userService.fbLogin();
  }

}
