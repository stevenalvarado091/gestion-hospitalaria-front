import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
  MatButtonModule,
  MatIconModule,
  MatMenuModule
],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  @Output()
  menuToggle = new EventEmitter<void>();

  nombreCompleto = '';

  rol = '';

  inicial = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.nombreCompleto =
      this.authService.getNombreCompleto() ?? '';

    this.rol =
      this.authService.getRol() ?? '';

    this.inicial =
      this.nombreCompleto.charAt(0).toUpperCase();

  }

  alternarMenu(): void {

    this.menuToggle.emit();

  }

  cerrarSesion(): void {

  this.authService.logout();

  this.router.navigateByUrl('/login', {
    replaceUrl: true
  });

}

}