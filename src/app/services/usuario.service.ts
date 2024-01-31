import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

import { Usuario } from '../models/usuario.model';

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

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token' : this.token
      }
    }
    ).pipe(
      map( (resp: any) => {
        console.log(resp);

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

    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    } )


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

}
