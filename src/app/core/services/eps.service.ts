import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EpsService {

  private url = 'http://localhost:8080/eps';

  constructor(
    private http: HttpClient
  ) {}

  listar() {
    return this.http.get<any[]>(this.url);
  }

}
