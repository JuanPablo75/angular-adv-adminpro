import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  // Obtiene el token almacenado en el localStorage
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  // Define los encabezados con el token para las peticiones HTTP
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  // Transforma los resultados de búsqueda de usuarios
  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.google, user.img, user.uid, user.role)
    );
  }

  // Transforma los resultados de búsqueda de hospitales
  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados.map(hospital => new Hospital(hospital.nombre, hospital.img, hospital.uid));
  }

  // Transforma los resultados de búsqueda de médicos
  private transformarMedicos(resultados: any[]): Medico[] {
    return resultados.map(medico => new Medico(medico.nombre, medico.img, medico.uid));
  }

  /**
   * Realiza una búsqueda en la base de datos.
   * @param tipo Tipo de entidad a buscar (usuarios, médicos, hospitales).
   * @param termino Término de búsqueda.
   * @param desde Índice desde el cual obtener resultados (paginación).
   * @returns Un observable con los resultados de la búsqueda transformados según el tipo.
   */
  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string, desde: number = 0) {
    // Construye la URL de la búsqueda
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}?desde=${desde}`;
    
    // Realiza la petición HTTP y transforma los resultados según el tipo de búsqueda
    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformarUsuarios(resp.resultados);

          case 'hospitales':
            return this.transformarHospitales(resp.resultados);

          case 'medicos':
            return this.transformarMedicos(resp.resultados);

          default:
            return [];
        }
      })
    );
  }

  busquedaGlobal( termino: string){

    const url = `${ base_url }/todo/${ termino }`;
    return this.http.get<any[]>(url, this.headers);
  }

}
