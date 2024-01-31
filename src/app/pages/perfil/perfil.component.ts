import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubida: File;
  public imgTemp : any = null;

  constructor ( private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private fileUploadService: FileUploadService){

    this.usuario = usuarioService.usuario;

    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, [ Validators.required ]],
      email: [ this.usuario.email, [ Validators.required, Validators.email ]],
      });
  }

  actualizarPerfil(){
    // console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
        .subscribe( 
          {
          next : resp => {
            const { nombre, email } = this.perfilForm.value;
            // console.log(resp);
            this.usuario.nombre = nombre;
            this.usuario.email = email;

            Swal.fire( 'Guardado', 'Cambios fueron guardados', 'success');
          },
          error : err =>{
            Swal.fire( 'Error', err.error.msg, 'error')
          }
          }
        )
        
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
    this.fileUploadService
    .actualizarFoto( this.imagenSubida, 'usuarios', this.usuario.uid )
    .then( img =>  {
      this.usuario.img = img;
      Swal.fire( 'Guardado', 'Imagen de usuario actualizada', 'success');
    })
    .catch( err => {
      Swal.fire( 'Error', 'No se pudo subir la imagen', 'error')

      console.log(err);
    })
  }
 
}
