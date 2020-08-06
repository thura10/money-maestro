import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.page.html',
  styleUrls: ['./bar.page.scss'],
})
export class BarPage implements OnInit {

  @Input() barData: number;
  @Input() budget: number;
  @Input() currency: string;
  @Input() length: string;

  constructor() { }

  ngOnInit() {
  }

}
