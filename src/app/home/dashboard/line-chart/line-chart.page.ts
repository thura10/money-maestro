import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.page.html',
  styleUrls: ['./line-chart.page.scss'],
})
export class LineChartPage implements OnInit, OnChanges {

  @Input() currency: string;
  @Input() lineData: any;

  @Output() filter = new EventEmitter<boolean>();

  type = 'line';
  data: any;
  options: any;

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  constructor() { }

  ngOnInit() {
    if (this.lineData) {
      this.createChart();
    }
  }
  ngOnChanges() {
    if (this.lineData) {
      this.createChart();
    }
  }

  createChart() {
    let data = Object.values(this.lineData).map((value: number) => {
      return Math.abs(value)
    })
    let labels = Object.keys(this.lineData).map(label => {
      return this.monthNames[parseInt(label) -1]
    });
    let currency = this.currency || "$"

    let color = document.body.classList.contains('dark') ? 'white' : 'dark';

    this.data = {
      datasets: [{
        data: data,
        borderWidth: 3,
        fill: false,
        borderColor: "#0B4177",
        pointBackgroundColor: color,
        pointBorderColor: color,
        cubicInterpolationMode: "monotone"
      }],
      labels: labels,
    };

    this.options = {
      scales: {
        yAxes: [{
          ticks: {
            callback: function(value, index, values) {
                return currency + value;
            },
            fontColor: color,
            stepSize: 100,
            maxTicksLimit: 10,
          },
        }],
        xAxes: [{
          ticks: {
            fontColor: color
          }
        }]
      },
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            return currency + tooltipItem.value;
          }
        }
      },
    }
  }
}
