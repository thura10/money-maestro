import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.page.html',
  styleUrls: ['./edit-bill.page.scss'],
})
export class EditBillPage implements OnInit {

  @Input() uid: string;
  @Input() currency: string;
  @Input() bill: any;

  myForm: FormGroup;
  nameError: boolean;
  amountError: boolean;

  constructor(private modal: ModalController, private fb: FormBuilder, private userService: UserService, private toastController: ToastController) { }

  ngOnInit() {
    let date = new Date();
    date.setUTCDate(this.bill.date[0]);
    date.setUTCMonth(this.bill.date[1] -1);
    date.setUTCFullYear(this.bill.date[2]);
    date.setUTCHours(0,0,0,0);

    this.myForm = this.fb.group({
      name: this.bill.name,
      recurring: this.bill.recurring,
      amount: this.bill.amount,
      date: date.toISOString(),
    })
  }

  dismiss(edit: boolean) {
    this.modal.dismiss({
      edit: edit
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

    let form = this.myForm.value;
    if (!form.name) form.name = this.bill.name;
    if (!form.amount) form.amount = this.bill.amount;

    form.date = this.getDate(this.myForm.value.date);
    form.amount = Math.abs(parseFloat(form.amount));

    this.userService.editBill(this.uid, this.bill.id, form)
    .then(res => {
      this.presentToast('Saved');
      this.dismiss(true);
    })
    .catch(err => {
      console.log(err);
      this.presentToast('An error occurred. Please check your connection.')
    })
  }
  getDate(date) {
    let year = parseInt(date.slice(0,4));
    let month = parseInt(date.slice(5,7));
    let day = parseInt(date.slice(8,10));
    return [day, month, year];
  }


}
