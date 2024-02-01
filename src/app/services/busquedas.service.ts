import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios( resultados : any[] ) : Usuario[]{


    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.google, user.img , user.uid, user.role)
    )
  }
  buscar(
    tipo : 'usuarios'|'medicos'|'hospitales',
    termino: string,
    desde: number = 0
  ) {

    const url = `${ base_url }/todo/coleccion/${ tipo }/${termino}?desde=${desde}`;
    return this.http.get<any[]>( url, this.headers )
                    .pipe(
                      map( (resp : any) => {
                        switch ( tipo ) {
                          case 'usuarios':
                            return this.transformarUsuarios( resp.resultados );

                          default:
                            return [];
                        }
                      } )
                    )
  }

}
