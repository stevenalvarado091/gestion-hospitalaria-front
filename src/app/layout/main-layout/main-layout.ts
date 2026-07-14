import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from '../sidebar/sidebar';
import {Router, NavigationEnd} from '@angular/router';
import { filter } from 'rxjs';
import { IngresoService } from '../../core/services/ingreso.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
  CommonModule,
  RouterOutlet,
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  SidebarComponent,
  NavbarComponent
],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})

export class MainLayoutComponent {

  detalleIngreso = false;

  ingreso: any = null;

  ingresoId: number | null = null;

  constructor(
    private router: Router,
    private ingresoService: IngresoService,
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