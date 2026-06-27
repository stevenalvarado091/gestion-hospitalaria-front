import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {

  detalleIngreso = false;
  ingresoId: number | null = null;

  constructor(private router: Router) {

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
    } else {
      this.ingresoId = null;
    }
  }

}
