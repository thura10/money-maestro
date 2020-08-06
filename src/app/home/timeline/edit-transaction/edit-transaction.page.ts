import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ModalController, ToastController, Platform, ActionSheetController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';

import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.page.html',
  styleUrls: ['./edit-transaction.page.scss'],
})
export class EditTransactionPage implements OnInit, AfterViewInit {

  selectedCategory;
  myForm: FormGroup;

  saving: boolean;

  @Input() uid: string;
  @Input() transaction: any;
  @Input() currency: string;

  imageUrl: string;

  constructor(private modal: ModalController, private fb: FormBuilder, private userService: UserService, private toast: ToastController, private camera: Camera, private platform: Platform, public actionSheetController: ActionSheetController, private imagePicker: ImagePicker) { }

  ngOnInit() {
    let date = new Date();
    date.setUTCDate(this.transaction.day)
    date.setUTCMonth(this.transaction.month-1)
    date.setUTCFullYear(this.transaction.year);
    date.setUTCHours(0,0,0,0);

    this.myForm = this.fb.group({
      'merchant': this.transaction.merchant,
      'incoming': this.transaction.incoming,
      'amount': Math.abs(this.transaction.amount),
      'date': date.toISOString(),
      'comment': this.transaction.comment,
    })
    this.selectedCategory = this.transaction.category
    this.imageUrl = this.transaction.image;
  }

  ngAfterViewInit() {
    for (let tag of this.transaction.tags) {
      this.addChip(tag);
    }
  }

  dismiss(edit: boolean) {
    this.modal.dismiss({
      'edit': edit
    })
  }

  categories = [ { name: 'Entertainment', icon: 'videocam-outline', color: 'crimson' }, { name: 'Food', icon: 'restaurant-outline', color: 'chocolate' }, { name: 'Travel', icon: 'train-outline', color: 'teal' }, { name: 'Groceries', icon: 'basket-outline', color: 'mediumseagreen' }, { name: 'Shopping', icon: 'pricetag-outline', color: 'darkslateblue' }, { name: 'Others', icon: 'grid-outline', color: 'burlywood' }, ]
  
  selectCategory(category) {
    if (this.selectedCategory === category.name) {
      this.selectedCategory = null
    }
    else {
      this.selectedCategory = category.name
    }
  }

  
  @ViewChild('chipGroup') chipGroup: ElementRef;
  @ViewChild('tagInput', {read: ElementRef}) tagInput: ElementRef;
  tag = new FormControl('');

  createChip() {
    if (this.tag.value !== "" && this.tag.value !== null) {
      this.addChip(this.tag.value)
      this.tag.reset();
    }
  }
  addChip(tag: string) {
    const chip = document.createElement("ion-chip");
    chip.slot = "start";
    chip.style.setProperty('--background', 'mediumseagreen');
    chip.style.flex = "0 0 auto";
    chip.style.pointerEvents = "none";

    chip.innerHTML = `<ion-label color="white">${tag}</ion-label>`

    const chipBtn = document.createElement("ion-button");
    chipBtn.style.setProperty('--padding-start', '0');
    chipBtn.style.setProperty('--padding-end', '0');
    chipBtn.shape = "round";
    chipBtn.fill = "clear";
    chipBtn.innerHTML = `<ion-icon color="white" name="close-circle"></ion-icon>`

    chipBtn.onclick = () => {
      chip.parentNode.removeChild(chip);
    }
    chip.insertAdjacentElement('beforeend', chipBtn);

    this.chipGroup.nativeElement.insertBefore(chip, this.tagInput.nativeElement);
  }

  removeChip() {
    if (this.tag.value === '' || this.tag.value === null) {
      const chips = this.chipGroup.nativeElement.querySelectorAll('ion-chip');

      if (chips.length > 0) {
        const chip = chips[chips.length - 1];
        if (chip.outline === true) {
          chip.parentNode.removeChild(chip);
        } else {
          chip.outline = true;
          chip.color = "primary";
        }
      }
    }
  }
  unhighlightChip(event) {
    if (!(event.key === "Backspace" || event.keyCode === 8)) {
      const chips = this.chipGroup.nativeElement.querySelectorAll('ion-chip');

      if (chips.length > 0) {
        const chip = chips[chips.length - 1];
        chip.outline = false;
        chip.color = null;
      }
    }
  }

  amountError: boolean;
  editTransaction() {
    if (!this.myForm.value.amount) {
      this.amountError = true;
      this.myForm.controls['amount'].valueChanges.subscribe((res) => {
        this.amountError = false;
      })
      return;
    }
    if (this.saving) return;
    
    let amount = Math.abs(parseFloat(this.myForm.value.amount));

    let date = this.getDate();
    let data = {
      "merchant": this.myForm.value.merchant,
      "amount": amount,
      "comment": this.myForm.value.comment,
      "incoming": this.myForm.value.incoming,
      "category": this.getCategory(),
      "day": date[0],
      "month": date[1],
      "year": date[2],
      "tags": this.getTags(),
      "image": this.imageUrl
    }

    this.saving = true;

    this.userService.editTransaction(this.uid, this.transaction.id, data)
    .then(res => {
      this.presentToast('Saved', 500)
      this.modal.dismiss({
        'edit': true,
        'data': Object.assign(data, {id: this.transaction.id})
      })
    })
    .catch(err => {
      this.presentToast('An unexpected error occurred. Please check your connection', 2000);
    })
  }

  async presentToast(message, duration) {
    const toast = await this.toast.create({
      message: message,
      duration: duration,
      color: 'light'
    });
    toast.present();
  }

  getDate() {
    if (this.myForm.value.date) {
      let date=  this.myForm.value.date;

      let year = parseInt(date.slice(0,4));
      let month = parseInt(date.slice(5,7));
      let day = parseInt(date.slice(8,10));
      return [day, month, year];
    }
    else {
      return [this.transaction.day, this.transaction.month, this.transaction.year];
    }
  }
  getCategory() {
    if (this.selectedCategory) return this.selectedCategory;
    return this.transaction.category;
  }
  getTags() {
    let tags = []
    const chips = this.chipGroup.nativeElement.querySelectorAll('ion-label');

    for (let chip of chips) {
      tags.push(chip.innerText);
    }
    return tags;
  }

  async addPhoto() {
    let buttons = [{
      text: 'Take photo',
      icon: 'camera',
      handler: () => {
        this.takePhoto();
      }
    }, {
      text: 'Choose from gallery',
      icon: 'image',
      handler: () => {
        this.pickPhoto();
      }
    }];
    if (this.imageUrl) {
      buttons.push({
        text: "Remove photo",
        icon: 'trash',
        handler: () => {
          this.imageUrl = "";
        }
      })
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Add a photo',
      buttons: buttons
    });
    await actionSheet.present();
  }
  //open camera to take a picture
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.camera.getPicture(options).then(async (imageData) => {
          let blob = this.getBlob(imageData, ".jpg")

          this.userService.uploadPhoto(blob).then(res => {
            res.ref.getDownloadURL().then(res => {
              this.imageUrl = res;
            })
            .catch(err => {
              this.presentToast("Error uploading image", 1000);
            })
          })
          .catch(err => {
            this.presentToast("Error uploading image", 1000);
          })
        }, 
        (err) => {
          console.log(err);
        });
      }
    })
  }
  //ask user for permission for storage access
  pickPhoto() {
    this.platform.ready().then(() => {
      this.imagePicker.hasReadPermission().then(
        (result) => {
          if (!result) {
            this.imagePicker.requestReadPermission().then(canRead => {
              if(canRead) {
                this.getPicture();
              }
            });
          } else {
            this.getPicture();
          }
        }, (err) => {
          this.imagePicker.requestReadPermission().then(canRead => {
            if(canRead) {
              this.getPicture();
            }
          });
          console.log(err);
        });
    })
  }
  //open photo picker to pick image
  getPicture() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 100,
      outputType: 1
    };

    this.imagePicker.getPictures(options).then(async (results) => {
      for (let i=0; i< results.length; i++) {
        let blob = this.getBlob(results[i], ".jpg")

        this.userService.uploadPhoto(blob).then(res => {
          res.ref.getDownloadURL().then(res => {
            this.imageUrl = res;
          })
          .catch(err => {
            this.presentToast("Error uploading image", 1000);
          })
        })
        .catch(err => {
          this.presentToast("Error uploading image", 1000);
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  private getBlob(b64Data:string, contentType:string, sliceSize:number= 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

}
