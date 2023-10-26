import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: []
})
export class IncrementadorComponent implements OnInit{

  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`
  }

  // @Input('valor') progreso: number = 40;
  @Input() progreso: number = 40;
  @Input() btnClass: string = 'btn-primary';

  @Output() valorSalida: EventEmitter<number> = new EventEmitter();

  get getPorcentaje(){
    return `${this.progreso}%`;
  }

  cambiarValor(valor:number){

    if(this.progreso >=100 && valor >=0){
      this.valorSalida.emit(100);
      return this.progreso = 100;
    }

    if(this.progreso <=0 && valor <=0){
      this.valorSalida.emit(0)
      return this.progreso = 0;
    }
    
     this.progreso = this.progreso += valor;
     this.valorSalida.emit(this.progreso);
     return this.progreso;
  }

  onChange( nuevoValor: number ){

    if(nuevoValor >= 100){
      this.progreso = 100;
    }else if(nuevoValor <= 0){
      this.progreso = 0;
    }else{
      this.progreso = nuevoValor;
    }

    this.valorSalida.emit(this.progreso);

    // this.valorSalida.emit(valor);
  }
}
