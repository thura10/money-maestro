import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.page.html',
  styleUrls: ['./add-bill.page.scss'],
})
export class AddBillPage implements OnInit {

  @Input() uid: string;
  @Input() currency: string;

  myForm: FormGroup;
  nameError: boolean;
  amountError: boolean;

  constructor(private modal: ModalController, private fb: FormBuilder, private userService: UserService, private toastController: ToastController) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      recurring: false,
      amount: ['', Validators.required],
      date: new Date().toISOString(),
    })
  }
  dismiss(add: boolean) {
    this.modal.dismiss({
      add: add
    });
  }
  async presentToast(message: string) {
    const toast =  await this.toastController.create({
      message: message,
      duration: 1000
    })
    toast.present();
  }

  addBill() {
    this.nameError= true;
    this.amountError = true;

    if (this.myForm.valid) {
      let form = this.myForm.value
      form.date = this.getDate(this.myForm.value.date);
      form.amount = Math.abs(parseFloat(form.amount))

      this.userService.addBill(this.uid, form)
      .then(res => {
        this.presentToast('Saved');
        this.dismiss(true);
      })
      .catch(err => {
        console.log(err);
        this.presentToast('An error occurred. Please check your connection.')
      })
    }
  }
  getDate(date) {
    let year = parseInt(date.slice(0,4));
    let month = parseInt(date.slice(5,7));
    let day = parseInt(date.slice(8,10));
    return [day, month, year];
  }

}
