import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

// URL base para las peticiones HTTP
const base_url = environment.base_url;

/**
 * Servicio para gestionar la información de los usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  /** Representa la información del usuario autenticado. */
  public usuario: Usuario;

  /**
   * Constructor del servicio UsuarioService.
   * @param http - Instancia del servicio HttpClient para realizar peticiones HTTP.
   * @param router - Instancia del servicio Router para la navegación en la aplicación.
   */
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /** Obtiene el token almacenado en el localStorage. */
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  /** Obtiene el identificador único (uid) del usuario autenticado. */
  get uid(): string {
    return this.usuario.uid || '';
  }

  /** Obtiene las cabeceras HTTP con el token de autorización. */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /**
   * Valida la vigencia del token de autenticación.
   * @returns Observable que emite un booleano indicando si el token es válido.
   */
  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img, uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', google, img, uid, role);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  /**
   * Registra un nuevo usuario.
   * @param formData - Datos del formulario de registro.
   * @returns Observable que emite la respuesta del servidor.
   */
  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  /**
   * Actualiza el perfil del usuario autenticado.
   * @param data - Datos a actualizar (email, nombre, role).
   * @returns Observable que emite la respuesta del servidor.
   */
  actualizarPerfil(data: { email: string, nombre: string, role: string }) {
    // No dejar que cambie el role
    data = {
      ...data,
      role: this.usuario.role
    };
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  /**
   * Inicia sesión de un usuario.
   * @param formData - Datos del formulario de inicio de sesión.
   * @returns Observable que emite la respuesta del servidor.
   */
  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  /** Cierra la sesión del usuario y redirige a la página de inicio de sesión. */
  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  /**
   * Carga la lista de usuarios paginada.
   * @param desde - Número de página a partir de la cual cargar usuarios (opcional, por defecto 0).
   * @returns Observable que emite un objeto con el total de usuarios y la lista de usuarios cargados.
   */
  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers).pipe(
      map((resp: any) => {
        const usuarios = resp.usuarios.map(
          user => new Usuario(user.nombre, user.email, '', user.google, user.img, user.uid, user.role)
        );
        return {
          total: resp.total,
          usuarios
        }
      })
    );
  }

  /**
   * Elimina un usuario.
   * @param usuario - Objeto Usuario a eliminar.
   * @returns Observable que emite la respuesta del servidor.
   */
  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  /**
   * Guarda los cambios realizados en un usuario.
   * @param usuario - Objeto Usuario con los cambios.
   * @returns Observable que emite la respuesta del servidor.
   */
  guardarUsuario(usuario: Usuario) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }
}
