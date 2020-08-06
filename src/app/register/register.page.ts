import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerGroup: FormGroup;

  nameError: string;
  emailError: string;
  passwordError: string;

  dateOfBirth: string = "";

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.registerGroup = this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': '',
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'password2': '',
      'dateOfBirth': ''
    })
  }

  register() {
    if (this.registerGroup.value.password !== this.registerGroup.value.password2) {
      this.passwordError = "Please enter the same password"
    }
    else if (this.registerGroup.invalid) {
      if (this.registerGroup.controls['email'].invalid) {
        if (this.registerGroup.controls['email'].errors.required) {
          this.emailError = "Enter an email address";
        }
        else if (this.registerGroup.controls['email'].errors.email) {
          this.emailError = "Enter a valid email address"
        }
      }
      else if (this.registerGroup.controls['firstName'].invalid) {
        this.nameError = "Enter a first name"
      }
      else if (this.registerGroup.controls['password'].invalid) {
        this.passwordError = "Password must be six or more characters"
      }
    }
    else {
      this.userService.register(this.registerGroup.value.email, this.registerGroup.value.password)
      .then(result => {
        this.userService.setUserDetails(result.user.uid, {
          firstName: this.registerGroup.value.firstName,
          lastName: this.registerGroup.value.lastName,
          dateOfBirth: this.registerGroup.value.dateOfBirth,
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
      })
      .catch(err => {
        console.log(err)
        if (err && err.code == "auth/email-already-in-use") {
          this.emailError = "Email already in use"
        }
        else if (err && err.code ==  "auth/invalid-email") {
          this.emailError = "Invalid email"
        }
        else {
          this.passwordError = "An unknown error occurred. Please check your connection"
        }
      })
    }

  }
  
  nameInput() {
    if (this.nameError) this.nameError = "";
  }
  emailInput() {
    if (this.emailError) this.emailError = "";
  }
  passwordInput() {
    if (this.passwordError) this.passwordError = "";
  }

}
