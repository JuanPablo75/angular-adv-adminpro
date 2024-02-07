// Importaciones necesarias de Angular y librerías externas
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';

// Decorador y metadatos del componente
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: [] // Estilos del componente (vacío en este caso)
})
export class UsuariosComponent implements OnDestroy {

  @ViewChild('txtTermino') inputBusqueda!: ElementRef; // Referencia al elemento de búsqueda

  // Propiedades del componente
  public totalUsuarios: number = 0; // Total de usuarios
  public totalUsuariosB: number = 0; // Total de usuarios en búsqueda
  public usuarios: Usuario[] = []; // Lista de usuarios
  public usuariosTemp: Usuario[] = []; // Lista temporal para restablecer la búsqueda
  public desde: number = 0; // Índice para la paginación de la lista principal
  public desdeB: number = 0; // Índice para la paginación de los resultados de búsqueda
  public cargando: boolean = true; // Indica si se está cargando la información
  public imgSubs: Subscription; // Suscripción para cambios en las imágenes

  // Constructor del componente con inyección de dependencias
  constructor(
    private usuarioService: UsuarioService, // Servicio para operaciones relacionadas con usuarios
    private busquedasService: BusquedasService, // Servicio para realizar búsquedas
    private modalImagenService: ModalImagenService // Servicio para gestionar modales de imágenes
  ) {}

  // Método ngOnDestroy para liberar recursos al destruir el componente
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe(); // Desuscribirse para evitar pérdida de memoria
  }

  // Método ngOnInit que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.cargarUsuarios(); // Inicializar la lista de usuarios al cargar el componente

    // Suscripción al evento de cambio de imagen con un retraso
    this.imgSubs = this.modalImagenService.imagenCambiada
      .pipe(delay(100))
      .subscribe(img => this.cargarUsuarios());
  }

  // Método para cargar la lista de usuarios
  cargarUsuarios() {
    this.cargando = true; // Indicar que se está cargando la información
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios}) => {
        this.totalUsuarios = total; // Actualizar el total de usuarios
        this.usuarios = usuarios; // Actualizar la lista de usuarios mostrados
        this.usuariosTemp = usuarios; // Actualizar la lista temporal
        this.cargando = false; // Indicar que se ha completado la carga
      });
  }

  // Método para cambiar la página de la lista de usuarios
  cambiarPagina(valor: number) {
    this.desde += valor;

    // Validaciones para asegurar que desde no sea negativo o mayor que el total
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios(); // Recargar la lista de usuarios después de cambiar la página
  }

  // Método para cambiar la página de la búsqueda de usuarios
  cambiarPaginaBuscar(valor: number) {
    this.desdeB += valor;

    // Validaciones para asegurar que desdeB esté dentro de los límites
    if (this.desdeB < 0) {
      this.desdeB = 0;
    } else if (this.desdeB >= this.totalUsuarios) {
      this.desdeB -= valor;
    }

    this.buscar(this.inputBusqueda.nativeElement.value); // Ejecutar la búsqueda con el término actual
  }

  // Método para realizar una búsqueda de usuarios
  buscar(termino: string) {
    if (termino.length === 0) {
      // Restaurar la lista original si el término de búsqueda está vacío
      return this.usuarios = this.usuariosTemp;
    }

    // Realizar búsqueda utilizando el servicio
    return this.busquedasService.buscar('usuarios', termino, this.desdeB)
      .subscribe((resultados: Usuario[]) => {
        this.usuarios = resultados; // Actualizar la lista de usuarios con los resultados de la búsqueda
      });
  }

  // Método para eliminar un usuario con confirmación mediante SweetAlert
  eliminarUsuario(usuario: Usuario) {

    // Validar que no se esté intentando borrar el propio usuario
    if (usuario.uid === this.usuarioService.usuario.uid) {
      return Swal.fire('Error', 'No puede borrar su propio usuario desde aquí');
    }

    // Mostrar confirmación de borrado utilizando SweetAlert
    return Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar el usuario
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {
            this.cargarUsuarios(); // Recargar la lista de usuarios después de eliminar
            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );
          });
      }
    });
  }

  // Método para cambiar el rol de un usuario
  cambiarRole(usuario: Usuario) {

    // Llamar al servicio para guardar los cambios en el rol
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp => {
        console.log(resp); // Imprimir la respuesta en la consola (puede ser útil para depuración)
      });
  }

  // Método para abrir el modal de imágenes de un usuario
  abrirModal(usuario: Usuario) {
    console.log(usuario); // Imprimir información del usuario en la consola (puede ser útil para depuración)
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
