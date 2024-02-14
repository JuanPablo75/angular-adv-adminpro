import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarMenu(){
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];
    
    if (this.menu.length === 0) {
      
    }
  }
  // Constructor del servicio
  constructor() { }

  // // Arreglo que define la estructura del menú lateral
  // menu: any[] = [
  //   {
  //     titulo: 'Dashboard',
  //     icono: 'mdi mdi-gauge',
  //     // Submenú para la opción 'Dashboard'
  //     submenu: [
  //       { titulo: 'Main', url: '/' },
  //       { titulo: 'Gráficas', url: 'grafica1' },
  //       { titulo: 'ProgressBar', url: 'progress' },
  //       { titulo: 'Promesas', url: 'promesas' },
  //       { titulo: 'Rxjs', url: 'rxjs' }
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimiento',
  //     icono: 'mdi mdi-folder-lock-open',
  //     // Submenú para la opción 'Mantenimiento'
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios' },
  //       { titulo: 'Hospitales', url: 'hospitales' },
  //       { titulo: 'Médicos', url: 'medicos' },
  //     ]
  //   }
  // ];

}
