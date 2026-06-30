import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { IngresoService } from '../../core/services/ingreso.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TipoDocumento } from '../../core/enums/tipo-documento.enum';
import { MatPaginatorModule } from '@angular/material/paginator';

//IMPORRT PARA CORREGIR ERROR DE VISTA
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    MatPaginatorModule,
    MatIconModule
  ],
  templateUrl: './ingresos.html',
  styleUrls: ['./ingresos.css']
})
export class IngresosComponent implements OnInit {

  ingresos: any[] = [];
  numeroIngreso = '';
  tipoDocumento = '';
  tiposDocumento = Object.values(TipoDocumento);
  numeroDocumento = '';
  nombrePaciente = '';
  pagina = 0;
  tamanio = 10;
  mensajeBusqueda = '';

  totalRegistros = 0;

  constructor(
    private ingresoService: IngresoService,
    private router: Router,

    // CONFIGURACION PARA ERROR DE VISTA
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {

    this.cargarIngresos();
  }

  cargarIngresos() {

    this.ingresoService
      .listarIngresosPaginados(
        this.pagina,
        this.tamanio
      )
      .subscribe({

        next: (response: any) => {

          this.ingresos = response.content;
          this.totalRegistros = response.totalElements;
          this.cdr.detectChanges();

        },

        error: (error: any) => {

          console.error(error);

        }

      });

  }

  cambiarPagina(event: any) {

    this.pagina = event.pageIndex;
    this.tamanio = event.pageSize;
    this.cdr.detectChanges();
    this.cargarIngresos();

  }

  abrirIngreso(id: number) {
    this.router.navigate([
      '/ingresos',
      id,
      'resumen'
    ]);
  }

  buscar() {

  this.mensajeBusqueda = '';

  // Buscar por número de ingreso
  if (this.numeroIngreso.trim() !== '') {

    this.ingresoService
      .getByNumeroIngreso(this.numeroIngreso)
      .subscribe({

        next: (data: any) => {

          this.ingresos = [data];
          this.mensajeBusqueda = '';
          this.cdr.detectChanges();

        },

        error: (err) => {

          this.ingresos = [];
          this.mensajeBusqueda = err.error.mensaje;
          this.cdr.detectChanges();

        }

      });

    return;
  }

  // Buscar por documento
  if (
    this.tipoDocumento &&
    this.numeroDocumento.trim() !== ''
  ) {

    this.ingresoService
      .getByDocumento(
        this.tipoDocumento,
        this.numeroDocumento
      )
      .subscribe({

        next: (data: any) => {

          this.ingresos = data;
          this.mensajeBusqueda = '';

          if (data.length === 0) {
            this.mensajeBusqueda = 'No se encontraron resultados.';
          }

          this.cdr.detectChanges();

        },

        error: (err) => {

          this.ingresos = [];
          this.mensajeBusqueda = err.error.mensaje;
          this.cdr.detectChanges();

        }

      });

    return;
  }

  // Buscar por nombre
  if (this.nombrePaciente.trim() !== '') {

    this.ingresoService
      .buscarPorNombre(this.nombrePaciente)
      .subscribe({

        next: (data: any) => {

          this.ingresos = data;
          this.mensajeBusqueda = '';

          if (data.length === 0) {
            this.mensajeBusqueda = 'No se encontraron resultados.';
          }

          this.cdr.detectChanges();

        },

        error: (err) => {

          this.ingresos = [];
          this.mensajeBusqueda = err.error.mensaje;
          this.cdr.detectChanges();

        }

      });

    return;
  }

  this.cdr.detectChanges();
  this.cargarIngresos();

} 


  limpiarFiltros() {

  this.numeroIngreso = '';
  this.tipoDocumento = '';
  this.numeroDocumento = '';
  this.nombrePaciente = '';
  this.pagina = 0;

  this.cdr.detectChanges();
  this.cargarIngresos();

}

}
