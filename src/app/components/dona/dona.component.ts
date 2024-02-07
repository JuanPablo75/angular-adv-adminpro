// Angular Core y Librerías Externas
import { Component, Input } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: [],
})
export class DonaComponent {
  // Propiedad para recibir el título de la dona como entrada
  @Input() titulo: string = "Sin título";

  // Propiedad para recibir las etiquetas de la dona como entrada
  @Input() labels: string[] = ['No label', 'No label', 'No label'];

  // Propiedad para recibir los datos de la dona como entrada
  @Input() data: ChartData<'doughnut'> = {
    labels: this.labels,
    datasets: [
      {
        // Datos de ejemplo para la dona (pueden ser modificados según la necesidad)
        data: [350, 450, 100],

        // Colores de fondo para cada segmento de la dona
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
      },
    ],
  };
}
