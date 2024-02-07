// Angular Core y Librerías Externas
import { Pipe, PipeTransform } from '@angular/core';

import { environment } from 'src/environments/environment';

// Obtiene la URL base del entorno (development, production, etc.)
const base_url = environment.base_url; // => http://localhost:3000/api/

// Decorador y metadatos del pipe Imagen
@Pipe({
  name: 'imagen' // Nombre del pipe para ser utilizado en plantillas HTML
})
export class ImagenPipe implements PipeTransform {

  // Transforma la URL de la imagen según el tipo (usuarios, medicos, hospitales)
  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {

    // Si no hay URL de imagen, devuelve una URL predeterminada para "no-image"
    if (!img) {
      return `${base_url}/upload/${tipo}/no-image`;
    } else if (img.includes('https')) {
      // Si la URL de imagen ya es una URL completa (empieza con 'https'), la devuelve sin modificaciones
      return img;
    } else {
      // Si la URL de imagen es relativa, la concatena con la URL base y el tipo para obtener la URL completa
      return `${base_url}/upload/${tipo}/${img}`;
    }
  }
}
