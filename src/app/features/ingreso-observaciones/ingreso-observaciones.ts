import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IngresoService } from '../../core/services/ingreso.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ObservacionService } from '../../core/services/observacion.service';

import { ChangeDetectorRef } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';

import { MatFormFieldModule } from '@angular/material/form-field';


import { MatButtonModule } from '@angular/material/button';
import { ObservacionItemComponent } from '../../shared/components/observacion-item/observacion-item.component';
import { ModuloLayoutComponent } from '../../shared/components/modulo-layout/modulo-layout.component';


@Component({
  selector: 'app-ingreso-observaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    ModuloLayoutComponent,
    ObservacionItemComponent
  ],

  templateUrl: './ingreso-observaciones.html',
  styleUrl: './ingreso-observaciones.css'
})
export class IngresoObservacionesComponent implements OnInit {

  mostrarFormulario = false;

  ingresoId!: number;

  tiposObservacion = [
    'GENERAL',
    'MEDICA',
    'ADMINISTRATIVA'
  ];

  nuevaObservacion = {
    descripcion: '',
    tipoObservacion: 'GENERAL'
  };

  observaciones: any[] = [];
  observacionesFiltradas: any[] = [];

  filtroCategoria = 'TODAS';

  constructor(
    private route: ActivatedRoute,
    private observacionService: ObservacionService,
    private ingresoService: IngresoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const id =
      this.route.parent?.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.ingresoId = Number(id);

    this.cargarObservaciones();
  }

  cargarObservaciones() {

    this.observacionService
      .listarPorIngreso(this.ingresoId)
      .subscribe({
        next: (data: any) => {

          this.observaciones = data.map((o: any) => ({
            ...o,
            expandido: false
          }));

          this.observacionesFiltradas = [...this.observaciones];

          this.aplicarFiltro();
          this.cdr.detectChanges();
        }
      });

  }


crearObservacion() {

  if (!this.nuevaObservacion.descripcion.trim()) {
    return;
  }

  console.log(this.nuevaObservacion);

  this.ingresoService
    .crearObservacion(
      this.ingresoId,
      this.nuevaObservacion
    )
    .subscribe({

      next: (response: any) => {

        this.observaciones.unshift({
          ...response,
          expandido: false
        });

        this.aplicarFiltro();

        this.cerrarFormulario();

        this.cdr.detectChanges();
      }

    });

}

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {

    this.mostrarFormulario = false;

    this.nuevaObservacion = {
      descripcion: '',
      tipoObservacion: 'GENERAL'
    };
  }


  aplicarFiltro(): void {

    if (this.filtroCategoria === 'TODAS') {

      this.observacionesFiltradas = [...this.observaciones];
      return;

    }

    this.observacionesFiltradas = this.observaciones.filter(
      o => o.tipoObservacion === this.filtroCategoria
    );

  }


  toggleObservacion(observacion: any): void {
    observacion.expandido = !observacion.expandido;
  }



}
