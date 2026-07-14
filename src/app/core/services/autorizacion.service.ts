import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionService {

  private url = 'http://localhost:8080/autorizaciones';

  constructor(private http: HttpClient) {}

  listarPorIngreso(ingresoId: number) {

    return this.http.get<any[]>(
      `${this.url}/ingreso/${ingresoId}`
    );

  }

  crear(ingresoId: number, formData: FormData) {

    return this.http.post(
      `${this.url}/ingreso/${ingresoId}`,
      formData
    );

  }

  descargar(id: number) {

  window.open(
    `${this.url}/${id}/descargar`,
    '_blank'
  );

}

}