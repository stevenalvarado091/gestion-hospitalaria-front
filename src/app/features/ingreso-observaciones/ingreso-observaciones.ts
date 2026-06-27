import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IngresoService } from '../../core/services/ingreso';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ObservacionService } from '../../core/services/observacion';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ingreso-observaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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
    tipoObservacion: 'GENERAL',
    usuario: 'STIVEEN',
    rolUsuario: 'AUDITOR'
  };

  observaciones: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private observacionService: ObservacionService,
    private ingresoService: IngresoService,
    private cdr: ChangeDetectorRef
  ) {}

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
          this.observaciones = data;
          this.cdr.detectChanges();
        }
      });

  }


  crearObservacion() {

    if (!this.nuevaObservacion.descripcion.trim()) {
      return;
    }

    this.ingresoService
      .crearObservacion(
        this.ingresoId,
        this.nuevaObservacion
      )
      .subscribe({

        next: (response: any) => {

          this.observaciones.unshift(response);

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
      tipoObservacion: 'GENERAL',
      usuario: 'STIVEEN',
      rolUsuario: 'AUDITOR'
    };
  }

}
