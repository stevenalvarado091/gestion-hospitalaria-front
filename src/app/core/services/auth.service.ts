import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(
  private http: HttpClient,
  private router: Router,
  private snackBar: MatSnackBar
) {}

  login(numeroDocumento: string, password: string): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/login`, {
      numeroDocumento,
      password
    }).pipe(
      tap(response => {

        localStorage.setItem('token', response.token);
        localStorage.setItem('numeroDocumento', response.numeroDocumento);
        localStorage.setItem('nombreCompleto', response.nombreCompleto);
        localStorage.setItem('rol', response.rol);

      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getNumeroDocumento(): string | null {
    return localStorage.getItem('numeroDocumento');
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

  logout(mostrarMensaje: boolean = false): void {

  localStorage.removeItem('token');
  localStorage.removeItem('numeroDocumento');
  localStorage.removeItem('nombreCompleto');
  localStorage.removeItem('rol');

  if (mostrarMensaje) {

    this.snackBar.open(
      'La sesión ha expirado. Inicie sesión nuevamente.',
      'Cerrar',
      {
        duration: 4000
      }
    );

  }

  this.router.navigate(['/login']);

}

}