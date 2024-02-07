// Angular Core y Librerías Externas
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Librería para notificaciones visuales
import Swal from 'sweetalert2';

// Servicio de Usuario
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // Variable para rastrear si se ha enviado el formulario
  public formSubmitted = false;

  // Formulario Reactivo para el registro de usuario
  public registerForm = this.fb.group({
    nombre: ['Juan Pablo', [Validators.required]],
    email: ['alujuanpablo@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]],
    confirm_password: ['123456', [Validators.required]],
    terminos: [true, [Validators.required]],
  }, {
    // Validador personalizado para verificar que las contraseñas coincidan
    validator: this.passwordsIguales('password', 'confirm_password')
  });

  // Constructor del Componente con Inyección de Dependencias
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  // Método para crear un nuevo usuario
  crearUsuario() {
    // Establece que el formulario ha sido enviado
    this.formSubmitted = true;

    // Verifica la validez del formulario antes de continuar
    if (!this.registerForm.valid) {
      return;
    }

    // Realiza el posteo de la información del usuario
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(
        {
          next: (resp) => {
            // Registro exitoso, redirige al usuario
            console.log('Usuario creado.');
            console.log(resp);
            this.router.navigateByUrl('/');
          },
          error: (err) => {
            // Manejo de errores y notificación visual
            Swal.fire('Error', err.error.msg, 'error');
          }
        }
      );
  }

  // Método para verificar si un campo no es válido
  campoNoValido(campo: string): boolean {
    return this.registerForm.get(campo)!.invalid && this.formSubmitted;
  }

  // Método para verificar si se aceptaron los términos y condiciones
  aceptaTerminos() {
    return !this.registerForm.get('terminos')!.value && this.formSubmitted;
  }

  // Método para verificar si las contraseñas no coinciden
  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')!.value;
    const pass2 = this.registerForm.get('confirm_password')!.value;

    return (pass1 !== pass2) && this.formSubmitted;
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordsIguales(pass1: string, pass2: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control!.value === pass2Control!.value) {
        pass2Control!.setErrors(null);
      } else {
        pass2Control!.setErrors({ noEsIgual: true });
      }
    };
  }
}
