import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class IngresoService {

  private url = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listarIngresos() {
    return this.http.get(
      `${this.url}/ingresos`
    );
  }

  getByNumeroIngreso(numero: string) {
    return this.http.get(
      `${this.url}/ingresos/numero/${numero}`
    );
  }

  getByDocumento(tipo: string, numero: string) {
    return this.http.get(
      `${this.url}/ingresos/buscar-documento?tipoDocumento=${tipo}&numeroDocumento=${numero}`    );
  }

  listarEps() {
    return this.http.get(
      `${this.url}/eps`
    );
  }

  crearIngreso(request: any) {
    return this.http.post(
      `${this.url}/ingresos`,
      request
    );
  }

  getDetalle(id: number) {
    return this.http.get(
      `${this.url}/ingresos/${id}`
    );
  }

  getTimeline(id: number) {
    return this.http.get(
      `${this.url}/ingresos/${id}/timeline`
    );
  }

  crearObservacion(ingresoId: number, observacion: any) {
  return this.http.post(
    `${this.url}/observaciones/ingresos/${ingresoId}`,
    observacion
  );
}

listarIngresosPaginados(
  pagina: number,
  tamanio: number
) {
  return this.http.get<any>(
    `${this.url}/ingresos/pagina?pagina=${pagina}&tamanio=${tamanio}`
  );
}

buscarPorNombre(nombre: string) {

  return this.http.get(
    `${this.url}/ingresos/buscar-nombre`,
    {
      params: {
        nombre
      }
    }
  );

}

}