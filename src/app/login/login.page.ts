import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginGroup: FormGroup;
  emailError: string;
  passwordError: string;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.loginGroup = this.fb.group({
      'email': '',
      'password': ''
    })
  }

  login() {
    if (!(this.emailError || this.passwordError)) {
        this.userService.login(this.loginGroup.value.email, this.loginGroup.value.password).then((result) => {
          this.router.navigateByUrl('/')
        }
      ).catch((err) => {
        if (err && err.code == "auth/invalid-email") {
          this.emailError = "Invalid Email"
        }
        else if (err && err.code == "auth/user-not-found") {
          this.emailError = "An account with the specified email does not exist"
        }
        else if (err && err.code == "auth/wrong-password") {
          this.passwordError = "Incorrect Password"
        }
        else {
          this.emailError = " ";
          this.passwordError = "An error occurred while logging in. Please check your connection"
        }
      });
    }
  }
  
  emailInput() {
    if (this.emailError) this.emailError = "";
  }
  passwordInput() {
    if (this.passwordError) this.passwordError = "";
  }

}
