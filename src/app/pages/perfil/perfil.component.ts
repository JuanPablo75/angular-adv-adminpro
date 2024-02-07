// Importaciones necesarias de Angular y librerías externas
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Modelos y Servicios
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: [] 
})
export class PerfilComponent {

  // Propiedades del componente
  public perfilForm: FormGroup; // Formulario reactivo para el perfil
  public usuario: Usuario; // Información del usuario actual
  public imagenSubida: File; // Imagen seleccionada para subir
  public imgTemp: any = null; // Representación temporal de la imagen seleccionada

  // Constructor del componente con inyección de dependencias
  constructor(
    private fb: FormBuilder, // Servicio para construir formularios reactivos
    private usuarioService: UsuarioService, // Servicio para operaciones relacionadas con usuarios
    private fileUploadService: FileUploadService // Servicio para subir archivos
  ) {
    this.usuario = usuarioService.usuario; // Obtener información del usuario actual

    // Inicializar el formulario reactivo con datos del usuario actual
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required]],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  // Método para actualizar el perfil del usuario
  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe({
        next: resp => {
          const { nombre, email } = this.perfilForm.value;
          this.usuario.nombre = nombre;
          this.usuario.email = email;
          Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
        },
        error: err => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      });
  }

  // Método para cambiar la imagen temporalmente antes de subirla
  cambiarImagen(file: File) {
    this.imagenSubida = file;

    // Si no hay archivo, restablecer la imagen temporal
    if (!file) {
      return this.imgTemp = null;
    }

    // Crear un lector de archivos para obtener una representación base64 de la imagen
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  // Método para subir la imagen al servidor
  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubida, 'usuarios', this.usuario.uid)
      .then(img => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
      })
      .catch(err => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
