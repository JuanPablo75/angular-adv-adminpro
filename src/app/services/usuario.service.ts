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

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;

  constructor(  private http : HttpClient,
                private router : Router) { }


  get token(): string {
    return localStorage.getItem('token') || '';
  }
  
  get uid(): string {
    return this.usuario.uid || '';
  }
  
  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token' : this.token
      }
    }
    ).pipe(
      map( (resp: any) => {
        // console.log(resp);

        const {
          email,
          google,
          nombre,
          role,
          img,
          uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', google, img, uid, role);

        localStorage.setItem('token', resp.token);

        return true;
      }),
      catchError( error => of(false))
    );
  }

  crearUsuario ( formData : RegisterForm){

    return this.http.post(`${base_url}/usuarios`, formData )
                    .pipe(
                      tap( (resp: any) => {
                        localStorage.setItem( 'token', resp.token)
                      })
                    )
  }

  actualizarPerfil( data: { email:string, nombre: string, role: string }){

    //No dejar que cambie el role
     data = {
       ...data,
       role: this.usuario.role
     }
    return this.http.put(`${base_url}/usuarios/${ this.uid }`, data, this.headers);

  }

  login ( formData : LoginForm){

    return this.http.post(`${base_url}/login`, formData )
                    .pipe(
                      tap( (resp: any) => {
                        localStorage.setItem( 'token', resp.token)
                      })
                    )
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login')
  }

  cargarUsuarios( desde: number = 0){

    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>( url, this.headers )
                    .pipe(
                      map( (resp: any) => {
                        const usuarios = resp.usuarios.map( 
                          user => new Usuario(user.nombre, user.email, '', user.google, user.img , user.uid, user.role))
                        return {
                          total: resp.total,
                          usuarios
                        } 
                      })
                    )
  }

  eliminarUsuario( usuario: Usuario ){

    const url = `${ base_url }/usuarios/${ usuario.uid }`;

    return this.http.delete( url, this.headers );
  }

  guardarUsuario( usuario: Usuario){

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario , this.headers );
  }
}
