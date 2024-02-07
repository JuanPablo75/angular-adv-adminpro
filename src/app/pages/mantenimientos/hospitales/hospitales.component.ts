// Importaciones necesarias de Angular y librerías externas
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

// Importación del modelo Hospital
import { Hospital } from 'src/app/models/hospital.model';

// Importación de servicios necesarios
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})

export class HospitalesComponent implements OnInit, OnDestroy {

  // Referencia al elemento de entrada de búsqueda utilizando ViewChild
  @ViewChild('txtTermino') inputBusqueda!: ElementRef;

  // Propiedades del componente
  public hospitales: Hospital[] = []; // Lista de hospitales mostrados en la interfaz
  public hospitalesTemp: Hospital[] = []; // Lista temporal para restablecer la búsqueda
  public cargando: boolean = true; // Indica si se está cargando la información
  public desde: number = 0; // Índice para la paginación de la lista principal
  public desdeB: number = 0; // Índice para la paginación de los resultados de búsqueda
  public totalHospitales: number = 0; // Número total de hospitales
  private imgSubs: Subscription; // Suscripción para cambios en las imágenes

  // Constructor del componente
  constructor(
    private hospitalService: HospitalService, // Servicio para operaciones relacionadas con hospitales
    private modalImagenService: ModalImagenService, // Servicio para gestionar modales de imágenes
    private busquedaService: BusquedasService // Servicio para realizar búsquedas
  ) { }

  // Método ngOnDestroy para liberar recursos al destruir el componente
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe(); // Desuscribirse para evitar pérdida de memoria
  }

  // Método ngOnInit que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.cargarHospitales(); // Inicializar la lista de hospitales al cargar el componente

    // Suscripción al evento de cambio de imagen con un retraso
    this.imgSubs = this.modalImagenService.imagenCambiada
      .pipe(delay(100))
      .subscribe(img => this.cargarHospitales());
  }

  // Método para cargar la lista de hospitales
  cargarHospitales() {
    this.cargando = true; // Indicar que se está cargando la información
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe(resp => {
        this.cargando = false; // Indicar que se ha completado la carga
        this.hospitales = resp.hospitales; // Actualizar la lista de hospitales mostrados
        this.hospitalesTemp = resp.hospitales; // Actualizar la lista temporal
        this.totalHospitales = resp.total; // Actualizar el total de hospitales
      });
  }

  // Método para cambiar la página de la lista de hospitales
  cambiarPagina(valor: number) {
    this.desde += valor;

    // Validaciones para asegurar que desde no sea negativo o mayor que el total
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalHospitales) {
      this.desde -= valor;
    }

    this.cargarHospitales(); // Recargar la lista de hospitales después de cambiar la página
  }

  // Método para cambiar la página de la búsqueda de hospitales
  cambiarPaginaBuscar(valor: number) {
    this.desdeB += valor;

    // Validaciones para asegurar que desdeB esté dentro de los límites
    if (this.desdeB < 0) {
      this.desdeB = 0;
    } else if (this.desdeB >= this.totalHospitales) {
      this.desdeB -= valor;
    }

    this.buscar(this.inputBusqueda.nativeElement.value); // Ejecutar la búsqueda con el término actual
  }

  // Método para realizar una búsqueda de hospitales
  buscar(termino: string) {
    if (termino.length === 0) {
      // Restaurar la lista original si el término de búsqueda está vacío
      return this.hospitales = this.hospitalesTemp;
    }

    // Realizar búsqueda utilizando el servicio
    return this.busquedaService.buscar('hospitales', termino, this.desdeB)
      .subscribe((resultados) => {
        this.hospitales = resultados; // Actualizar la lista de hospitales con los resultados de la búsqueda
      });
  }

  // Método para guardar cambios en la información de un hospital
  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        this.cargarHospitales(); // Recargar la lista de hospitales después de actualizar
        Swal.fire('Actualizado', hospital.nombre, 'success'); // Mostrar mensaje de éxito
      });
  }

  // Método para eliminar un hospital con confirmación mediante SweetAlert
  eliminarHospital(hospital: Hospital) {
    return Swal.fire({
      title: "¿Borrar hospital?",
      text: `Está a punto de borrar el hospital: ${hospital.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar el hospital
        this.hospitalService.eliminarHospital(hospital._id)
          .subscribe(resp => {
            this.cargarHospitales(); // Recargar la lista de hospitales después de eliminar
            Swal.fire('Borrado', hospital.nombre, 'success'); // Mostrar mensaje de éxito
          });
      }
    });
  }

  // Método asíncrono para abrir un cuadro de diálogo para crear un nuevo hospital
  async abriSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if (value.trim().length > 0) {
      // Llamar al servicio para crear un nuevo hospital
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          // Agregar el nuevo hospital a la lista
          this.hospitales.push(resp.hospital);
        });
    }
  }

  // Método para abrir el modal de imágenes de un hospital
  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }
}
