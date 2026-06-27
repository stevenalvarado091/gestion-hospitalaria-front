import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { IngresoService } from './core/services/ingreso';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

//IMPORRT PARA CORREGIR ERROR DE VISTA
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  detalleIngreso = false;
  ingreso: any = null;
  ingresoId: number | null = null;

  constructor(
    private router: Router,
    private ingresoService: IngresoService,

    // CONFIGURACION PARA ERROR DE VISTA
        private cdr: ChangeDetectorRef
  ) {

    this.validarRuta(this.router.url);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.validarRuta(this.router.url);
      });
  }

  private validarRuta(url: string): void {

    const match = url.match(/^\/ingresos\/(\d+)\/.*/);

    this.detalleIngreso = !!match;

    if (match) {

      this.ingresoId = Number(match[1]);

      this.ingresoService
        .getDetalle(this.ingresoId)
        .subscribe({
          next: (data: any) => {
            this.ingreso = data;
            this.cdr.detectChanges();
          }
        });

    } else {

      this.ingresoId = null;
      this.ingreso = null;

    }
  }

}
