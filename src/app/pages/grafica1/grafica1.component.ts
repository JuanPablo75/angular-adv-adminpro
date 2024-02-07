// Angular Core y Librerías Externas
import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styleUrls: []
})
export class Grafica1Component {

  // Datos para la primera gráfica de donut
  public labels1: string[] = ['Jamon', 'Chorizo', 'Lomo'];

  public data1: ChartData<'doughnut'> = {
    labels: this.labels1,
    datasets: [
      {
        data: [40, 20, 10],
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
      },
    ],
  };

  // Datos para la segunda gráfica de donut
  public labels2: string[] = ['Cerveza', 'Cocacola', 'Vino'];

  public data2: ChartData<'doughnut'> = {
    labels: this.labels2,
    datasets: [
      {
        data: [100, 150, 30],
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
      },
    ],
  };

  // Datos para la tercera gráfica de donut
  public labels3: string[] = ['Jamon', 'Chorizo', 'Lomo'];

  public data3: ChartData<'doughnut'> = {
    labels: this.labels3,
    datasets: [
      {
        data: [10, 2, 4],
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
      },
    ],
  };

  // Datos para la cuarta gráfica de donut
  public labels4: string[] = ['Coches', 'Furgonetas', 'Motos'];

  public data4: ChartData<'doughnut'> = {
    labels: this.labels4,
    datasets: [
      {
        data: [350, 200, 100],
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
      },
    ],
  };

}
