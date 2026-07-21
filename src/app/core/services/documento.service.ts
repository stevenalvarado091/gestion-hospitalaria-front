import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private url = 'http://localhost:8080/documentos';

  constructor(
    private http: HttpClient
  ) { }

  listarPorIngreso(ingresoId: number) {

    return this.http.get(
      `${this.url}/ingreso/${ingresoId}`
    );

  }

  subirDocumento(
    ingresoId: number,
    formData: FormData
  ) {

    return this.http.post(
      `${this.url}/ingreso/${ingresoId}`,
      formData
    );

  }

  descargar(id: number) {

  return this.http.get(
    `${this.url}/${id}/descargar`,
    {
      responseType: 'blob'
    }
  );

}

}