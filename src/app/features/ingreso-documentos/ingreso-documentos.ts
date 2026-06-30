import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';

import { TipoDocumentoArchivo } from '../../core/enums/tipo-documento-archivo.enum';

import { DocumentoService } from '../../core/services/documento.service';

//IMPORRT PARA CORREGIR ERROR DE VISTA
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ingreso-documentos',
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
  templateUrl: './ingreso-documentos.html',
  styleUrls: ['./ingreso-documentos.css']
})
export class IngresoDocumentosComponent {

  documentos: any[] = [];
  mostrarFormulario = false;
  tiposDocumento = Object.values(TipoDocumentoArchivo);
  tipoDocumentoSeleccionado = '';
  archivoSeleccionado?: File;
  nombreArchivo = '';
  tamanoArchivo = '';

  subiendo = false;

  private _ingresoId!: number;

@Input()
set ingresoId(value: number) {

    this._ingresoId = value;

    if (value) {

        this.cargarDocumentos(value);

    }

}

  get ingresoId(): number {

    return this._ingresoId;

  }

  constructor(
    private documentoService: DocumentoService,

    // CONFIGURACION PARA ERROR DE VISTA
    private cdr: ChangeDetectorRef
  ) { }


  cargarDocumentos(id: number) {

    this.documentoService
      .listarPorIngreso(id)
      .subscribe({

        next: (data: any) => {

          this.cdr.detectChanges();
          this.documentos = data;

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  abrirFormulario() {

    this.mostrarFormulario = true;

  }

  cerrarFormulario() {

    this.mostrarFormulario = false;

    this.tipoDocumentoSeleccionado = '';

    this.archivoSeleccionado = undefined;

    this.nombreArchivo = '';

    this.tamanoArchivo = '';

  }

  seleccionarArchivo(event: any) {

    const archivo = event.target.files[0];

    if (!archivo) {

      return;

    }

    this.archivoSeleccionado = archivo;

    this.nombreArchivo = archivo.name;

    this.tamanoArchivo =
      (archivo.size / 1024).toFixed(2) + ' KB';

  }

  guardarDocumento() {

    if (!this.archivoSeleccionado) {

      return;

    }

    if (!this.tipoDocumentoSeleccionado) {

      return;

    }

    const formData = new FormData();

    formData.append(
      'archivo',
      this.archivoSeleccionado
    );

    formData.append(
      'tipoDocumento',
      this.tipoDocumentoSeleccionado
    );

    formData.append(
      'usuario',
      'STIVEEN'
    );

    formData.append(
      'rolUsuario',
      'FACTURADOR'
    );

    this.subiendo = true;

    this.documentoService
      .subirDocumento(
        this._ingresoId,
        formData
      )
      .subscribe({

        next: () => {
          this.subiendo = false;
          this.cdr.detectChanges();
          this.cerrarFormulario();
          this.cargarDocumentos(this._ingresoId);
        },

        error: err => {

          this.subiendo = false;

          console.error(err);

        }

      });

  }


  descargarDocumento(id: number) {

    this.documentoService.descargar(id);

  }

}