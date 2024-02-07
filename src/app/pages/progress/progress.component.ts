// Importación del decorador Component desde Angular Core
import { Component } from '@angular/core';

// Decorador y metadatos del componente Progress
@Component({
  selector: 'app-progress', 
  templateUrl: './progress.component.html', 
  styleUrls: ['./progress.component.css'] 
})

export class ProgressComponent {

  // Propiedades para almacenar los valores de progreso
  progreso1: number = 25;
  progreso2: number = 35;

  // Método getter para obtener el valor del progreso 1 formateado con un símbolo de porcentaje
  get getProgreso1() {
    return `${this.progreso1}%`;
  }

  // Método getter para obtener el valor del progreso 2 formateado con un símbolo de porcentaje
  get getProgreso2() {
    return `${this.progreso2}%`;
  }
}
