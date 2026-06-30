import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {

  private url = 'http://localhost:8080/correos';

  constructor(private http: HttpClient) {}

  enviarCorreo(
    ingresoId: number,
    epsDestinoId: number,
    tipoCorreo: string,
    usuario: string,
    rolUsuario: string,
    archivos: File[]
  ) {

    const formData = new FormData();

    formData.append('ingresoId', ingresoId.toString());
    formData.append('epsDestinoId', epsDestinoId.toString());
    formData.append('tipoCorreo', tipoCorreo);
    formData.append('usuario', usuario);
    formData.append('rolUsuario', rolUsuario);

    archivos.forEach(archivo => {
      formData.append('archivos', archivo);
    });

    return this.http.post(
      `${this.url}/enviar`,
      formData
    );

  }

  listarPorIngreso(ingresoId: number) {

    return this.http.get(
      `${this.url}/ingreso/${ingresoId}`
    );

  }

}