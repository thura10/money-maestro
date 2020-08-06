import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.page.html',
  styleUrls: ['./pie-chart.page.scss'],
})
export class PieChartPage implements OnInit, OnChanges {

  constructor() { }
  
  ngOnInit() {
    if (this.pieData) {
      this.createPieChart();
    }
  }
  ngOnChanges() {
    if (this.pieData) {
      this.createPieChart();
      let empty = true;
      for (let i of Object.values(this.pieData)) {
        if (i) {
          empty = false;
          break;
        }
      }
      this.emptyDataset = empty;
    }
  }
  
  emptyDataset: boolean;

  @Input() pieData: any;
  @Input() length: string;
  @Input() currency: string;

  @Output() filter = new EventEmitter<string>();
  
  type = 'doughnut';
  data: any;
  options: any;

  createPieChart() {
    this.data = {
      datasets: [{
        data: Object.values(this.pieData),
        backgroundColor: ['crimson', 'chocolate', 'teal', 'mediumseagreen', 'darkslateblue', 'burlywood'],
        borderWidth: 1
      }],
      labels: Object.keys(this.pieData),
    };
    let currency = this.currency || "$";

    let fontColor = document.body.classList.contains('dark') ? 'white' : 'black';
    this.options = {
      legend: {
        position: 'right',
        labels: {
          fontSize: 14,
          fontColor: fontColor,
          filter: (item, data) => {
            return data.datasets[0].data[item.index] !== 0  
          }
        },
        onClick: (event, data) => {
          this.filter.emit(data.text);
        }
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            return data.labels[tooltipItem.index] + ": " + currency + data.datasets[0].data[tooltipItem.index]
          },
          labelColor: function(tooltipItem, chart) {
            return {
                borderColor: 'white',
                backgroundColor: chart.config.data.datasets[0].backgroundColor[tooltipItem.index]
            };
        },
        }
      },
      events: ['dblclick', 'click'],
      onHover: (event, data) => {
        if (event.type == 'dblclick' && data.length) {
          if (data[0]._model.label) this.filter.emit(data[0]._model.label)
        }
      },
      animation: {
        animateScale: true
      }
    }
  }
}
