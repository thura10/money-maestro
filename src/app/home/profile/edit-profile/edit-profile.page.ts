import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  @Input() uid: string;
  @Input() email: string;
  @Input() facebookLinked: boolean;
  @Input() providerLength: number;
  user: any;

  editGroup: FormGroup;
  passwordError: string;
  wrongPassword: boolean;

  constructor(private modal: ModalController, private fb: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.editGroup = this.fb.group({
      'firstName': '',
      'lastName': '',
      'password': '',
      'password2': '',
      'oldPassword': '',
      'email': this.email
    })
    this.editGroup.controls['email'].disable();
    this.userService.getUserPrefs(this.uid).subscribe(res => {
      this.user = res.data();
      this.editGroup.setValue({firstName: this.user.firstName, lastName: this.user.lastName, email: this.email, password: '', password2: '', oldPassword: ''})
    });
  }

  dismiss(edit: boolean) {
    this.modal.dismiss({
      'edit': edit
    })
  }

  saveProfile() {
    if (this.editGroup.value.password !== this.editGroup.value.password2) {
      return this.passwordError = "Please enter the same password"
    }

    let userData = {
      firstName: this.editGroup.value.firstName || this.user.firstName,
      lastName: this.editGroup.value.lastName || this.user.lastName
    };
    this.updateProfile(userData);
    
  }

  updateProfile(userData) {
    this.userService.setUserPrefs(this.uid, userData)
    .then(res => {
      this.updatePassword();
      return res
    })
    .catch(err => {
      console.log(err);
      this.dismiss(false);
    })
  }
  updatePassword() {
    if (this.editGroup.value.password != '') {
      if (this.facebookLinked && this.providerLength == 1) {
        this.userService.passwordLink(this.email, this.editGroup.value.password)
        .then(res => {
          this.dismiss(true);
        })
        .catch(err => {
          console.log(err)
          this.dismiss(true);
        })
      }
      else {
        this.userService.login(this.email, this.editGroup.value.oldPassword)
        .then(res => {
  
          this.userService.updatePassword(this.editGroup.value.password)
          .then(res => {
            this.dismiss(true);
          })
          .catch(err => {
            console.log(err)
            this.dismiss(true);
          })
        })
        .catch(err => {
          this.wrongPassword = true;
        })
  
      }
    }
    else {
      this.dismiss(true);
    }
  }

  passwordInput() {
    if (this.passwordError) {this.passwordError = null}
  }

  fbLink() {
    this.userService.fbLink();
  }

}
