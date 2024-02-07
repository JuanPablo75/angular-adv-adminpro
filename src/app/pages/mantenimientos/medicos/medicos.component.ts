// Importaciones necesarias de Angular y librerías externas
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

// Decorador y metadatos del componente
@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit, OnDestroy {

  @ViewChild('txtTermino') inputBusqueda!: ElementRef;

  public medicos: Medico[] = []; // Lista de médicos a mostrar
  public medicosTemp: Medico[] = []; // Lista temporal para restablecer la búsqueda
  public cargando: boolean = true; // Indica si se está cargando la información
  public desde: number = 0; // Índice para la paginación de la lista principal
  public desdeB: number = 0; // Índice para la paginación de los resultados de búsqueda
  public totalMedicos: number = 0; // Número total de médicos
  private imgSubs: Subscription; // Suscripción para cambios en las imágenes

  // Constructor del componente
  constructor(
    private medicoService: MedicoService, // Servicio para operaciones relacionadas con médicos
    private modalImagenService: ModalImagenService, // Servicio para gestionar modales de imágenes
    private busquedaService: BusquedasService // Servicio para realizar búsquedas
  ) {}

  // Método ngOnDestroy para liberar recursos al destruir el componente
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe(); // Desuscribirse para evitar pérdida de memoria
  }

  // Método ngOnInit que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.cargarMedicos(); // Inicializar la lista de médicos al cargar el componente

    // Suscripción al evento de cambio de imagen con un retraso
    this.imgSubs = this.modalImagenService.imagenCambiada
      .pipe(delay(100))
      .subscribe(img => this.cargarMedicos());
  }

  // Método para cargar la lista de médicos
  cargarMedicos() {
    this.cargando = true; // Indicar que se está cargando la información
    this.medicoService.cargarMedicos(this.desde)
      .subscribe(resp => {
        this.cargando = false; // Indicar que se ha completado la carga
        this.medicos = resp.medicos; // Actualizar la lista de médicos mostrados
        this.medicosTemp = resp.medicos; // Actualizar la lista temporal
        this.totalMedicos = resp.total; // Actualizar el total de médicos
      });
  }

  // Método para abrir el modal de imágenes de un médico
  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  // Método para realizar una búsqueda de médicos
  buscar(termino: string) {
    if (termino.length === 0) {
      // Restaurar la lista original si el término de búsqueda está vacío
      return this.medicos = this.medicosTemp;
    }

    // Realizar búsqueda utilizando el servicio
    return this.busquedaService.buscar('medicos', termino, this.desdeB)
      .subscribe((resultados) => {
        this.medicos = resultados; // Actualizar la lista de médicos con los resultados de la búsqueda
      });
  }

  // Método para cambiar la página de la lista de médicos
  cambiarPagina(valor: number) {
    this.desde += valor;

    // Validaciones para asegurar que desde no sea negativo o mayor que el total
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalMedicos) {
      this.desde -= valor;
    }

    this.cargarMedicos(); // Recargar la lista de médicos después de cambiar la página
  }

  // Método para cambiar la página de la búsqueda de médicos
  cambiarPaginaBuscar(valor: number) {
    this.desdeB += valor;

    // Validaciones para asegurar que desdeB esté dentro de los límites
    if (this.desdeB < 0) {
      this.desdeB = 0;
    } else if (this.desdeB >= this.totalMedicos) {
      this.desdeB -= valor;
    }

    this.buscar(this.inputBusqueda.nativeElement.value); // Ejecutar la búsqueda con el término actual
  }

  // Método para eliminar un médico con confirmación mediante SweetAlert
  borrarMedico(medico: Medico) {
    return Swal.fire({
      title: "¿Borrar médico?",
      text: `Está a punto de borrar el médico: ${medico.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar el médico
        this.medicoService.borrarMedico(medico._id)
          .subscribe(resp => {
            this.cargarMedicos(); // Recargar la lista de médicos después de eliminar
            Swal.fire('Borrado', medico.nombre, 'success'); // Mostrar mensaje de éxito
          });
      }
    });
  }
}
