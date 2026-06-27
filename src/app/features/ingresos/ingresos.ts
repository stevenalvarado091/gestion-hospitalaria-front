import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { IngresoService } from '../../core/services/ingreso';

//IMPORRT PARA CORREGIR ERROR DE VISTA
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './ingresos.html',
  styleUrls: ['./ingresos.css']
})
export class IngresosComponent implements OnInit {

  ingresos: any[] = [];

  constructor(
    private ingresoService: IngresoService,
    private router: Router,

    // CONFIGURACION PARA ERROR DE VISTA
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {

    this.cargarIngresos();
  }

  cargarIngresos() {

    this.ingresoService
      .listarIngresos() .subscribe({

        next: (data: any) => {

          this.ingresos = data;
          this.cdr.detectChanges();
        },

        error: (error: any) => {

          console.error(error);

        }
      });
  }

  abrirIngreso(id: number) {
    this.router.navigate([
      '/ingresos',
      id,
      'resumen'
    ]);
  }
}
