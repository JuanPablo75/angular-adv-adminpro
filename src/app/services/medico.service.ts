import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  // Obtiene el token almacenado en el localStorage
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  
  // Define los encabezados con el token para las peticiones HTTP
  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  /**
   * Carga la lista de médicos desde el servidor.
   * @param desde Índice a partir del cual se deben cargar los médicos.
   * @returns Un objeto que contiene un arreglo de médicos y el total de médicos en el servidor.
   */
  cargarMedicos(desde: number = 0){
    const url = `${base_url}/medicos?desde=${desde}`;
    return this.http.get(url, this.headers).pipe(
      map((resp: {ok: boolean, medicos: Medico[], total: number}) => {
        return {ok: true, medicos: resp.medicos, total: resp.total};
      })
    );
  }

  /**
   * Obtiene la información de un médico por su ID desde el servidor.
   * @param id ID del médico.
   * @returns Un objeto que indica si la operación fue exitosa y contiene la información del médico.
   */
  getMedicoById(id: string){
    const url = `${base_url}/medicos/${id}`;
    return this.http.get(url, this.headers).pipe(
      map((resp: {ok: boolean, medico: Medico}) => {
        return {ok: true, medico: resp.medico};
      })
    );
  }

  /**
   * Crea un nuevo médico en el servidor.
   * @param medico Objeto con la información del médico a crear.
   * @returns Observable con la respuesta del servidor.
   */
  crearMedico(medico: { nombre: string, hospital: string }){
    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  /**
   * Actualiza la información de un médico en el servidor.
   * @param medico Objeto con la información actualizada del médico.
   * @returns Observable con la respuesta del servidor.
   */
  actualizarMedico(medico: Medico){
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  /**
   * Elimina un médico en el servidor por su ID.
   * @param _id ID del médico a eliminar.
   * @returns Observable con la respuesta del servidor.
   */
  borrarMedico(_id: string){
    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
