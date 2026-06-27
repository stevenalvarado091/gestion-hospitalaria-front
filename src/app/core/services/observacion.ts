import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ObservacionService {

  private url = 'http://localhost:8080/observaciones';

  constructor(private http: HttpClient) {}

  listarPorIngreso(ingresoId: number) {
    return this.http.get(
      `${this.url}/ingresos/${ingresoId}`
    );
  }

}
