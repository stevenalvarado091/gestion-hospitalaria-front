import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { AutorizacionService } from '../../core/services/autorizacion.service';

@Component({
  selector: 'app-ingreso-autorizaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ingreso-autorizaciones.html',
  styleUrls: ['./ingreso-autorizaciones.css']
})
export class IngresoAutorizacionesComponent implements OnInit {

  ingresoId!: number;

  autorizaciones: any[] = [];

  mostrarFormulario = false;

  subiendo = false;

  nuevaAutorizacion = {
    numero: '',
    observacion: ''
  };

  archivoSeleccionado?: File;
  nombreArchivo = '';
  tamanoArchivo = '';

  constructor(
    private route: ActivatedRoute,
    private autorizacionService: AutorizacionService,
    private cdr: ChangeDetectorRef
  ) {}

ngOnInit(): void {

  let route = this.route;

  while (route.parent) {

    if (route.snapshot.paramMap.has('id')) {
      break;
    }

    route = route.parent;

  }

  const id = route.snapshot.paramMap.get('id');

  console.log('ID ingreso:', id);

  if (!id) {

    console.error('No se encontró el id del ingreso');

    return;

  }

  this.ingresoId = Number(id);

  this.cargarAutorizaciones();

}

  // =====================================================
  // CARGA LISTADO
  // =====================================================
 cargarAutorizaciones() {

  if (!this.ingresoId) {
    console.error('IngresoId no válido');
    return;
  }

  this.autorizacionService
    .listarPorIngreso(this.ingresoId)
    .subscribe({

      next: (data) => {

        this.autorizaciones = data;

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'Error cargando autorizaciones',
          err
        );

      }

    });

}

  // =====================================================
  // FORMULARIO
  // =====================================================
  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;

    this.nuevaAutorizacion = {
      numero: '',
      observacion: ''
    };

    this.eliminarArchivo();
  }

  // =====================================================
  // ARCHIVO
  // =====================================================
  seleccionarArchivo(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    this.archivoSeleccionado = archivo;
    this.nombreArchivo = archivo.name;
    this.tamanoArchivo = (archivo.size / 1024).toFixed(2) + ' KB';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    this.archivoSeleccionado = file;
    this.nombreArchivo = file.name;
    this.tamanoArchivo = (file.size / 1024).toFixed(2) + ' KB';
  }

  eliminarArchivo() {
    this.archivoSeleccionado = undefined;
    this.nombreArchivo = '';
    this.tamanoArchivo = '';
  }

  // =====================================================
  // GUARDAR
  // =====================================================
  puedeGuardar(): boolean {

  return !!(

      this.nuevaAutorizacion.numero?.trim()

      ||

      this.nuevaAutorizacion.observacion?.trim()

      ||

      this.archivoSeleccionado

  );

}

  guardarAutorizacion() {

  if (!this.puedeGuardar()) {
    return;
  }

  const formData = new FormData();

  if (this.archivoSeleccionado) {
    formData.append('archivo', this.archivoSeleccionado);
  }

  formData.append(
    'numeroAutorizacion',
    this.nuevaAutorizacion.numero || ''
  );

  formData.append(
    'observacion',
    this.nuevaAutorizacion.observacion || ''
  );

  this.subiendo = true;

  this.autorizacionService
    .crear(this.ingresoId, formData)
    .subscribe({

      next: () => {

        this.subiendo = false;

        this.cerrarFormulario();

        this.cargarAutorizaciones();

        this.cdr.detectChanges();

      },

      error: (err) => {

        this.subiendo = false;

        console.error(err);

      }

    });

}

  // =====================================================
  // DESCARGA
  // =====================================================
  descargarDocumento(id: number, nombreArchivo: string) {

  this.autorizacionService
    .descargar(id)
    .subscribe({

      next: (archivo: Blob) => {

        const url = window.URL.createObjectURL(archivo);

        const enlace = document.createElement('a');

        enlace.href = url;

        enlace.download = nombreArchivo;

        enlace.click();

        window.URL.revokeObjectURL(url);

      },

      error: (err) => {

        console.error(
          'Error descargando autorización',
          err
        );

      }

    });

}

}