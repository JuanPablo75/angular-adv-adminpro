import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Hospital } from '../models/hospital.model';

import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class HospitalService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el token de autenticación del almacenamiento local.
   * @returns El token de autenticación.
   */
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  /**
   * Devuelve los encabezados con el token de autenticación.
   * @returns Los encabezados con el token de autenticación.
   */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  /**
   * Obtiene el total de hospitales registrados en el sistema.
   * @returns Observable con el total de hospitales.
   */
  totalRes() {
    const url = `${base_url}/hospitales`;

    return this.http.get(url, this.headers)
      .pipe(map((res: any) => res.total));
  }

  /**
   * Carga la lista de hospitales paginada desde el servidor.
   * @param desde - Índice desde el cual se deben cargar los hospitales.
   * @returns Observable con la lista de hospitales y el total.
   */
  cargarHospitales(desde: number = 0) {
    const url = `${base_url}/hospitales?desde=${desde}`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, hospitales: Hospital[], total: number }) => {
          return { ok: true, hospitales: resp.hospitales, total: resp.total };
        })
      );
  }

  /**
   * Crea un nuevo hospital en el servidor.
   * @param nombre - Nombre del nuevo hospital.
   * @returns Observable con la respuesta del servidor.
   */
  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this.http.post(url, { nombre }, this.headers);
  }

  /**
   * Actualiza la información de un hospital existente en el servidor.
   * @param _id - ID del hospital que se va a actualizar.
   * @param nombre - Nuevo nombre del hospital.
   * @returns Observable con la respuesta del servidor.
   */
  actualizarHospital(_id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  /**
   * Elimina un hospital del servidor.
   * @param _id - ID del hospital que se va a eliminar.
   * @returns Observable con la respuesta del servidor.
   */
  eliminarHospital(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
