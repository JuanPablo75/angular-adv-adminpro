// Angular Core y Librerías Externas
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: []
})
export class IncrementadorComponent implements OnInit {

  // Valor inicial del progreso
  @Input() progreso: number = 40;

  // Clase CSS para el botón, por defecto es 'btn-primary'
  @Input() btnClass: string = 'btn-primary';

  // Evento de salida para notificar cambios en el valor del progreso
  @Output() valorSalida: EventEmitter<number> = new EventEmitter();

  // Método de inicialización del componente
  ngOnInit() {
    // Añade la clase CSS al botón
    this.btnClass = `btn ${this.btnClass}`;
  }

  // Propiedad computada para obtener el porcentaje formateado
  get getPorcentaje() {
    return `${this.progreso}%`;
  }

  // Método para cambiar el valor del progreso
  cambiarValor(valor: number) {
    // Manejo de casos límite para el progreso
    if (this.progreso >= 100 && valor >= 0) {
      this.valorSalida.emit(100);
      return this.progreso = 100;
    }

    if (this.progreso <= 0 && valor <= 0) {
      this.valorSalida.emit(0);
      return this.progreso = 0;
    }

    // Actualiza el progreso y emite el evento de salida
    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
    return this.progreso;
  }

  // Método llamado cuando cambia el valor desde el componente externo
  onChange(nuevoValor: number) {
    // Ajusta el valor del progreso según los límites
    if (nuevoValor >= 100) {
      this.progreso = 100;
    } else if (nuevoValor <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }

    // Emite el evento de salida con el nuevo valor del progreso
    this.valorSalida.emit(this.progreso);
  }
}
