import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(usuario: string, password: string): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/login`, {
      usuario,
      password
    }).pipe(
      tap(response => {

        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', response.usuario);
        localStorage.setItem('nombreCompleto', response.nombreCompleto);
        localStorage.setItem('rol', response.rol);

      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): string | null {
    return localStorage.getItem('usuario');
  }

  getNombreCompleto(): string | null {
    return localStorage.getItem('nombreCompleto');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('rol');
  }

}