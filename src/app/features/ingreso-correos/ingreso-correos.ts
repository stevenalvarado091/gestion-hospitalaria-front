import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ViewChild, ElementRef } from '@angular/core';

import { EpsService } from '../../core/services/eps.service';
import { CorreoService } from '../../core/services/correo.service';

import { ModuloLayoutComponent } from '../../shared/components/modulo-layout/modulo-layout.component';
import { CorreoItemComponent } from '../../shared/components/correo-item/correo-item.component';

//IMPORRT PARA CORREGIR ERROR DE VISTA
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ingreso-correos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    CorreoItemComponent,
    ModuloLayoutComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './ingreso-correos.html',
  styleUrls: ['./ingreso-correos.css']
})
export class IngresoCorreosComponent implements OnInit {

  ingresoId!: number;

  form!: FormGroup;

  tiposCorreo = [
    'AT1',
    'AT2',
    'AT3'
  ];

  epsList: any[] = [];
  epsFiltradas: any[] = [];
  dragActivo = false;

  epsControl = new FormControl('');

  archivos: File[] = [];
  mostrarFormulario = false;
  correos: any[] = [];
  enviando = false;

  constructor(
    private route: ActivatedRoute,
    private epsService: EpsService,
    private correoService: CorreoService,
    // CONFIGURACION PARA ERROR DE VISTA
    private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {

    const id = this.route.parent?.snapshot.paramMap.get('id');

    this.ingresoId = Number(id);

    this.form = new FormGroup({

      tipoCorreo: new FormControl(null, Validators.required),

      epsId: new FormControl(null, Validators.required)

    });

    

    this.cargarEps();
    this.cargarCorreos();

    this.epsControl.valueChanges.subscribe(valor => {
      this.filtrarEps(valor);
    });

  }

  @ViewChild('fileInput')
fileInput!: ElementRef<HTMLInputElement>;

  cargarEps() {

    this.epsService.listar()
      .subscribe({

        next: (eps: any) => {

          this.epsList = eps;
          this.epsFiltradas = eps;

        }

      });

  }

  filtrarEps(valor: any) {

    const filtro = (valor || '').toLowerCase();

    this.epsFiltradas = this.epsList.filter(e =>

      e.nombre.toLowerCase().includes(filtro) ||

      (e.codigo || '').toLowerCase().includes(filtro)

    );

  }

  seleccionarEps(eps: any) {

    this.form.patchValue({

      epsId: eps.id

    });

  }

  mostrarEps(eps: any): string {

    return eps ? eps.nombre : '';

  }

  seleccionarArchivos(event: any) {

  const files = Array.from(event.target.files as File[]);

  files.forEach(file => {

    const existe = this.archivos.some(a =>
      a.name === file.name &&
      a.size === file.size
    );

    if (!existe) {

      this.archivos.push(file);

    }

  });

}

eliminarArchivo(index: number) {

  this.archivos.splice(index, 1);

}

onDragOver(event: DragEvent) {

  event.preventDefault();

  this.dragActivo = true;

}

onDragLeave(event: DragEvent) {

  event.preventDefault();

  this.dragActivo = false;

}

onDrop(event: DragEvent) {

  event.preventDefault();

  this.dragActivo = false;

  if (!event.dataTransfer?.files) {
    return;
  }

  const files = Array.from(event.dataTransfer.files);

  files.forEach(file => {

    const existe = this.archivos.some(a =>
      a.name === file.name &&
      a.size === file.size
    );

    if (!existe) {
      this.archivos.push(file);
    }

  });

}

abrirSelectorArchivos() {

  this.fileInput.nativeElement.click();

}

enviarCorreo() {

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.enviando = true;

  this.correoService.enviarCorreo(

  this.ingresoId,

  this.form.value.epsId,

  this.form.value.tipoCorreo,

  this.archivos

).subscribe({

    next: (response: any) => {

      this.enviando = false;

      console.log('Correo enviado', response);

      alert('Correo enviado correctamente.');

      this.form.reset();

      this.epsControl.setValue('');

      this.archivos = [];

      this.mostrarFormulario = false;

      this.cargarCorreos();

    },

    error: (error: any) => {

      console.error(error);

      alert('Error enviando correo.');

    }

  });

}

cargarCorreos() {

  this.correoService
    .listarPorIngreso(this.ingresoId)
    .subscribe({

      next: (data: any) => {

        this.correos = data.map((c: any) => ({

          ...c,

          expandido: false,

          envios: (c.envios || []).map((e: any) => ({

            ...e,

            expandido: false,

            estadoVisual: e.fechaEjecutada
              ? 'ENVIADO'
              : e.fechaProgramada
                ? 'PROGRAMADO'
                : e.estado

          }))

        }));

        this.cdr.detectChanges();

      },

      error: (error: any) => {

        console.error(error);

      }

    });

}

toggleCorreo(correo: any): void {
  correo.expandido = !correo.expandido;
}

toggleEnvio(envio: any) {

  envio.expandido = !envio.expandido;

}

imprimirCorreo(correo: any, imprimir: boolean = true): void {

  correo.imprimiendo = true;

  // Fuerza que todos los envíos se muestren temporalmente
  if (correo.envios?.length) {
    correo.envios.forEach((envio: any) => envio.expandido = true);
  }

  setTimeout(() => {

    const elemento = document.getElementById(`correo-${correo.id}`);

    if (!elemento) {
      correo.imprimiendo = false;
      return;
    }

    // Clonamos el contenido para quitar iconos de acción
    const clon = elemento.cloneNode(true) as HTMLElement;

    clon.querySelectorAll('.correo-acciones').forEach(e => e.remove());
    clon.querySelectorAll('.adjunto-action').forEach(e => e.remove());
    clon.querySelectorAll('.adjunto-left mat-icon').forEach(e => e.remove());

    // Eliminar encabezados técnicos de reenvíos
    clon.querySelectorAll('.envio-header').forEach(e => e.remove());

    // Eliminar el texto "Historial del correo"
    clon.querySelectorAll('.evento-label').forEach(label => {
      if (label.textContent?.trim() === 'Historial del correo') {
        label.remove();
      }
    });

    const contenido = clon.innerHTML;

    if (!contenido) {
      correo.imprimiendo = false;
      return;
    }

    const ventana = window.open('', '_blank', 'width=1100,height=900');

    if (!ventana) {
      correo.imprimiendo = false;
      return;
    }

    ventana.document.write(`

      <html>

        <head>

          <title>${correo.asunto}</title>

          <style>

            body{
              font-family: Arial, Helvetica, sans-serif;
              margin:0;
              padding:32px;
              background:#f8fafc;
              color:#202124;
            }

            .correo-header-detalle{
              margin-bottom:24px;
              padding-bottom:16px;
              border-bottom:1px solid #e5e7eb;
            }

            .correo-asunto-grande{
              font-size:24px;
              font-weight:600;
              margin-bottom:12px;
            }

            .correo-meta-grid{
              display:flex;
              flex-direction:column;
              gap:6px;
              font-size:14px;
              color:#4b5563;
            }

            .correo-contenido{
              margin-top:24px;
            }

            .correo-mensaje{
              background:white;
              border:1px solid #e5e7eb;
              border-radius:14px;
              padding:22px;
              white-space:pre-wrap;
              line-height:1.7;
            }

            .evento-label{
              margin:28px 0 14px;
              font-size:12px;
              font-weight:700;
              text-transform:uppercase;
              color:#64748b;
            }

            .adjuntos-lista{
              display:flex;
              flex-wrap:wrap;
              gap:12px;
            }

            .adjunto-card{
              display:flex;
              align-items:center;
              gap:12px;
              border:1px solid #e5e7eb;
              border-radius:12px;
              padding:12px 14px;
              background:white;
            }

            .envio-card{
              margin-top:24px;
              border:1px solid #e5e7eb;
              border-radius:14px;
              overflow:hidden;
              background:white;
            }

            .envio-body{
              padding:22px;
            }

          </style>

        </head>

        <body>

          ${contenido}

        </body>

      </html>
    `);

    ventana.document.close();

    if (imprimir) {
      ventana.focus();
      ventana.print();
    } else {
      ventana.focus();
    }

    // Restaurar estado original
    if (correo.envios?.length) {
      correo.envios.forEach((envio: any) => envio.expandido = false);
    }

    correo.imprimiendo = false;

  }, 0);

}

abrirCorreoVentana(correo: any): void {

  this.imprimirCorreo(correo, false);

}


abrirAdjunto(id: number) {

  this.correoService
    .descargarAdjunto(id)
    .subscribe({

      next: (archivo: Blob) => {

        const url = window.URL.createObjectURL(archivo);

        window.open(url, '_blank');

      },

      error: (err) => {

        console.error('Error abriendo adjunto', err);

      }

    });

}

}
