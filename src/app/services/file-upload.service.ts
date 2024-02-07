import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  /**
   * Actualiza la foto de un usuario, médico u hospital en el servidor.
   * @param archivo Archivo de imagen a subir.
   * @param tipo Tipo de entidad ('usuarios', 'medicos' o 'hospitales').
   * @param id Identificador único de la entidad.
   * @returns Nombre del archivo actualizado o false si la actualización falla.
   */
  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ) {
    try {
      // Construye la URL de la actualización de la foto
      const url = `${base_url}/upload/${tipo}/${id}`;
      
      // Crea un objeto FormData para enviar la imagen como parte del cuerpo de la solicitud
      const formData = new FormData();
      formData.append('imagen', archivo);

      // Realiza la solicitud PUT al servidor con el token de autenticación en los encabezados
      const resp = await fetch(url, {
        method: "PUT",
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      // Obtiene la respuesta del servidor en formato JSON
      const data = await resp.json();

      // Verifica si la actualización fue exitosa y devuelve el nombre del archivo actualizado
      if (data.ok) {
        return data.nombreArchivo;
      } else {
        // Imprime el mensaje de error en la consola y retorna false
        console.log(data.msg);
        return false;
      }
    } catch (error) {
      // Imprime cualquier error inesperado en la consola y retorna false
      console.log(error);
      return false;
    }
  }
}
