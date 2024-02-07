// Angular Core y Librerías Externas
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Variable para rastrear si se ha enviado el formulario
  public formSubmitted = false;

  // Formulario Reactivo para el inicio de sesión
  public loginForm: FormGroup;

  // Constructor del Componente con Inyección de Dependencias
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    // Inicialización del formulario reactivo
    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  // Método para manejar el inicio de sesión
  login() {
    // Llamada al servicio de usuario para realizar el inicio de sesión
    this.usuarioService.login(this.loginForm.value).subscribe(
      {
        next: (resp) => {
          // Almacenamiento del correo electrónico si la opción "recordar" está habilitada
          if (this.loginForm.get('remember')!.value) {
            localStorage.setItem('email', this.loginForm.get('email')!.value);
          } else {
            localStorage.removeItem('email');
          }
          // Redirección a la página principal tras el inicio de sesión exitoso
          console.log('Usuario logeado.');
          console.log(resp);
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          // Manejo de errores y notificación visual
          console.log(err.error.msg);
          Swal.fire('Error', err.error.msg, 'error');
        }
      }
    );
    // console.log( this.loginForm.value);
  }
}
