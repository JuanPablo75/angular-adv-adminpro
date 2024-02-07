import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  // Propiedad privada para controlar la visibilidad del modal
  private _ocultarModal: boolean = true;

  // Propiedades públicas para almacenar información sobre la imagen a mostrar en el modal
  public tipo: 'usuarios'|'medicos'|'hospitales';
  public id: string;
  public img: string = '';

  // EventEmitter para notificar cuando la imagen cambia en el modal
  public imagenCambiada: EventEmitter<string> = new EventEmitter<string>();

  // Getter para acceder al estado de visibilidad del modal
  get ocultarModal() {
    return this._ocultarModal;
  }

  // Método para abrir el modal con información específica
  abrirModal(
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string,
    img: string = 'no-img'
  ){
    // Actualiza las propiedades y muestra el modal
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;

    // Verifica si la URL de la imagen ya es una URL completa (incluye 'https')
    if( img.includes('https')){
      this.img = img;
    } else {
      // Si no es una URL completa, construye la URL completa utilizando el tipo y el nombre de la imagen
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }
  }

  // Método para cerrar el modal
  cerrarModal(){
    this._ocultarModal = true;
  }

  // Constructor del servicio
  constructor() { }
}
