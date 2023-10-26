import { Component, Input } from '@angular/core';
import { ChartData  } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: [],
})
export class DonaComponent {

  @Input() titulo :string =  "Sin titulo";
  @Input() labels : string[] = ['No label', 'No label', 'No label']
  @Input() data : ChartData<'doughnut'> = {    
    labels: this.labels,
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
      },
    ],
  };
  
}
