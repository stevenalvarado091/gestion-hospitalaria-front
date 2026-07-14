import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  usuario = '';
  password = '';

  cargando = false;
  error = '';

  mostrarPassword = false;
  inicioSesionExitoso = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  iniciarSesion(): void {

    this.error = '';

    if (!this.usuario || !this.password) {
      this.error = 'Ingrese usuario y contraseña';
      return;
    }

    this.cargando = true;

    this.authService.login(
      this.usuario,
      this.password
    ).subscribe({

      next: () => {

        this.cargando = false;

        this.inicioSesionExitoso = true;

        setTimeout(() => {

          this.router.navigateByUrl('/', {
            replaceUrl: true
          });

        }, 1200);

      },

      error: () => {
        this.cargando = false;
        this.error = 'Usuario o contraseña incorrectos';
      }

    });
  }

}