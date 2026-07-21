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

          console.log(data);
          this.correos = data.map((c: any) => ({

            ...c,

            expandido: false

          }));
          this.cdr.detectChanges();

        },

        error: (error: any) => {

          console.error(error);

        }

      });

}

toggleCorreo(correo: any) {

  correo.expandido = !correo.expandido;

}


descargarAdjunto(id: number, nombreArchivo: string) {

  this.correoService
    .descargarAdjunto(id)
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
          'Error descargando adjunto',
          err
        );

      }

    });

}


}
