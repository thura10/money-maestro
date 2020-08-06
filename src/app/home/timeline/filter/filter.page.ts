import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ModalController, PickerController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';
import { Query } from 'angularfire2/firestore';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  myForm: FormGroup;

  @Input() currency: string;
  @Input() uid: string;
  clear: boolean = false;

  selectedCategory: string;
  categories = [ { name: 'Entertainment', icon: 'videocam-outline', color: 'crimson' }, { name: 'Food', icon: 'restaurant-outline', color: 'chocolate' }, { name: 'Travel', icon: 'train-outline', color: 'teal' }, { name: 'Groceries', icon: 'basket-outline', color: 'mediumseagreen' }, { name: 'Shopping', icon: 'pricetag-outline', color: 'darkslateblue' }, { name: 'Others', icon: 'grid-outline', color: 'burlywood' }, ]

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  dates: number[];
  years: number[];

  constructor(private fb: FormBuilder, private modal: ModalController, private userService: UserService) { }

  dismiss(result: boolean, data?: any) {
    this.modal.dismiss({
      result: result,
      data: data
    })
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      merchant: '',
      day: false,
      month: false,
      year: false,
      comment: '',
      incoming: false,
      amount: '',
      comparator: '=='
    })
    this.myForm.valueChanges.subscribe(res => {
      this.updateClearBtn();
    })

    this.dates = Array(31).fill(0).map((_, i) => i+1);
    this.years = Array(new Date().getFullYear() - 1999).fill(0).map((_, i) => i+2000).reverse();
  }
  clearInput() {
    this.myForm.setValue({merchant: '', day: false, month: false, year: false, comment: '', incoming: false, amount: '', comparator: '=='});
    this.selectedCategory = "";

    const chips = this.chipGroup.nativeElement.querySelectorAll('ion-chip');
    chips.forEach(chip => chip.remove());
    
    this.updateClearBtn();
  }

  checkIfFormEmpty() {
    for (let [form, value] of Object.entries(this.myForm.value)) {
      if (form == 'incoming' || form == 'comparator') continue;
      if (value) {
        return false;
      }
    }
    return true;
  }
  checkIfTagsEmpty() {
    const chips = this.chipGroup.nativeElement.querySelectorAll('ion-chip');
    if (chips.length > 0) {
      return false;
    }
    return true;
  }
  updateClearBtn() {
    if (this.checkIfFormEmpty() && this.checkIfTagsEmpty() && !this.selectedCategory) {
      this.clear = false;
    }
    else this.clear = true;
  }


  selectCategory(category) {
    if (this.selectedCategory === category.name) {
      this.selectedCategory = null;
    }
    else {
      this.selectedCategory = category.name;
    }
    this.updateClearBtn();
  }

  @ViewChild('chipGroup') chipGroup: ElementRef;
  @ViewChild('tagInput', {read: ElementRef}) tagInput: ElementRef;
  tag = new FormControl('');

  createChip() {
    if (this.tag.value !== "" && this.tag.value !== null) {
      this.addChip(this.tag.value)
      this.tag.reset();
      this.updateClearBtn();
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
      this.updateClearBtn();
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
    this.updateClearBtn();
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

  filter() {
    let ref: Query = this.userService.getFilteredTransactions(this.uid)

    if (this.myForm.value.amount) {
      ref = ref.where('amount', this.myForm.value.comparator, Math.abs(parseInt(this.myForm.value.amount)))
    }
    
    for (let [form, value] of Object.entries(this.myForm.value)) {
      if (form == 'incoming' || form == 'comparator' || form == 'amount') continue;
      if (value) {
        ref = ref.where(form, '==', value)
      }
    }
    
    if (this.selectedCategory) {
      ref = ref.where('category', '==', this.selectedCategory)
    }
    const chips = this.chipGroup.nativeElement.querySelectorAll('ion-label');
    if (chips.length > 0 ) {
      let tags = []  
      for (let chip of chips) {
        tags.push(chip.innerText);
      }
      ref = ref.where('tags', 'array-contains-any', tags)
    }
    ref.where('incoming', '==', this.myForm.value.incoming).get()
    .then(res => {
      let data = res.docs.map(doc => Object.assign(doc.data(), {id: doc.id}))
      this.dismiss(true, data);
    })

  }

}
