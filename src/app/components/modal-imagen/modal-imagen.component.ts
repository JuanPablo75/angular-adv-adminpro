// Angular Core y Librerías Externas
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

// Servicios
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: []
})

export class ModalImagenComponent {

  // Propiedades para gestionar la imagen en el componente
  public imagenSubida: File;
  public imgTemp: any = null;

  // Constructor con inyección de dependencias de servicios
  constructor(public modalImagenService: ModalImagenService,
              private fileUploadService: FileUploadService) {}

  // Método para cerrar el modal
  cerrarModal() {
    // Restaura las propiedades relacionadas con la imagen y cierra el modal
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  // Método para cambiar la imagen temporalmente en la vista previa
  cambiarImagen(file: File) {
    this.imagenSubida = file;

    // Si no hay archivo, se reinicia la imagen temporal
    if (!file) {
      return this.imgTemp = null;
    }

    // Lee el contenido del archivo y actualiza la imagen temporal
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  // Método para subir la imagen al servidor
  subirImagen() {
    // Obtiene el identificador y el tipo del servicio de modal
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    // Utiliza el servicio de carga de archivos para actualizar la foto
    this.fileUploadService
      .actualizarFoto(this.imagenSubida, tipo, id)
      .then(img => {
        // Muestra un mensaje de éxito y emite el evento de imagen cambiada
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
        this.modalImagenService.imagenCambiada.emit(img);
        this.cerrarModal();
      })
      .catch(err => {
        // Muestra un mensaje de error en caso de fallo en la carga de la imagen
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
