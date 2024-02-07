import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  // Elemento del DOM que representa la etiqueta link para cambiar el tema
  private linkTheme = document.querySelector('#theme');

  // Constructor del servicio
  constructor() {
    // Obtiene el tema almacenado en el localStorage o utiliza uno predeterminado
    const url: string = localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';

    // Establece el tema en la etiqueta link del DOM
    this.linkTheme?.setAttribute('href', url);
  }

  // Método para cambiar el tema de la aplicación
  changeTheme(theme: string) {
    // Construye la URL del nuevo tema
    const url = `./assets/css/colors/${theme}.css`;

    // Establece el nuevo tema en la etiqueta link del DOM
    this.linkTheme?.setAttribute('href', url);

    // Almacena el nuevo tema en el localStorage
    localStorage.setItem('theme', url);

    // Realiza la verificación del tema actual
    this.checkCurrentTheme();
  }

  // Método para verificar y resaltar el tema actual en los botones de selección
  checkCurrentTheme() {
    // Obtiene todos los elementos con la clase 'selector'
    const links = document.querySelectorAll('.selector');

    // Itera sobre los elementos y quita la clase 'working' para todos
    links.forEach(elem => {
      elem.classList.remove('working');

      // Obtiene el tema asociado al botón de selección
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;

      // Obtiene el tema actual de la etiqueta link en el DOM
      const currentTheme = this.linkTheme?.getAttribute('href');

      // Si el tema del botón coincide con el tema actual, agrega la clase 'working'
      if (btnThemeUrl === currentTheme) {
        elem.classList.add('working');
      }
    });
  }
}
