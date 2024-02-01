import { Component } from '@angular/core';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: []
})

export class ModalImagenComponent {

  public imagenSubida: File;
  public imgTemp : any = null;

  constructor( public modalImagenService: ModalImagenService,
               private fileUploadService: FileUploadService){}

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen( file: File) {
    this.imagenSubida = file;

    if( !file  ){ 
      return this.imgTemp = null;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    this.fileUploadService
    .actualizarFoto( this.imagenSubida, tipo, id )
    .then( img =>  {
      Swal.fire( 'Guardado', 'Imagen de usuario actualizada', 'success');

      this.modalImagenService.imagenCambiada.emit(img);
      this.cerrarModal();
    })
    .catch( err => {
      Swal.fire( 'Error', 'No se pudo subir la imagen', 'error')

      // console.log(err);
    })
  }
 

}
