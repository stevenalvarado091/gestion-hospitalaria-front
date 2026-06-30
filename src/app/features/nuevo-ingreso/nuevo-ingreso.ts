import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { EpsService } from '../../core/services/eps.service';
import { IngresoService } from '../../core/services/ingreso.service';

@Component({
  selector: 'app-nuevo-ingreso',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    CommonModule
  ],
  templateUrl: './nuevo-ingreso.html',
  styleUrls: ['./nuevo-ingreso.css']
})
export class NuevoIngresoComponent implements OnInit {

  constructor(
    private ingresoService: IngresoService,
    private epsService: EpsService,
    private snackBar: MatSnackBar
  ) {}

  form!: FormGroup;

  pacienteExiste = false;

  epsList: any[] = [];
  epsFiltradas: any[] = [];
  epsSeleccionada: any = null;
  epsControl = new FormControl('');

  tiposDocumento = [
    'CC','TI','RC','CE','PA','PPT','AS','MS','CD','SC','DE','NN'
  ];

  ngOnInit() {

    this.inicializarFormulario();

    // EPS load
    this.epsService.listar()
      .subscribe({
        next: (eps) => {
          this.epsList = eps;
          this.epsFiltradas = eps;
        }
      });

    this.epsControl.valueChanges.subscribe((value: string | null) => {
      this.filtrarEps(value);
    });

    this.form
      .get('fechaNacimiento')
      ?.valueChanges
      .subscribe(() => {
        this.calcularEdad();
      });

  }

  inicializarFormulario() {

    this.form = new FormGroup({

      epsId: new FormControl(null, [Validators.required]),

      numeroIngreso: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)
      ]),

      tipoDocumento: new FormControl(null, [Validators.required]),

      numeroDocumento: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)
      ]),

      primerNombre: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]),

      segundoNombre: new FormControl('', [
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
      ]),

      primerApellido: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]),

      segundoApellido: new FormControl('', [
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
      ]),

      fechaNacimiento: new FormControl(null, [Validators.required]),

      edad: new FormControl({
        value: '',
        disabled: true
      }),

      sexo: new FormControl(null, [Validators.required])

    });

  }

  buscarPaciente() {

    const tipo = this.form.get('tipoDocumento')?.value;
    const numero = this.form.get('numeroDocumento')?.value;

    if (!tipo || !numero) return;

    this.ingresoService.getByDocumento(tipo, numero)
      .subscribe({

        next: (paciente: any) => {

          this.pacienteExiste = true;

          this.form.patchValue({

            primerNombre: paciente.primerNombre,
            segundoNombre: paciente.segundoNombre,

            primerApellido: paciente.primerApellido,
            segundoApellido: paciente.segundoApellido,

            fechaNacimiento: paciente.fechaNacimiento

          });

          this.form.get('primerNombre')?.disable();
          this.form.get('segundoNombre')?.disable();
          this.form.get('primerApellido')?.disable();
          this.form.get('segundoApellido')?.disable();
          this.form.get('fechaNacimiento')?.disable();

        },

        error: () => {

          this.pacienteExiste = false;

          this.form.patchValue({

            primerNombre: '',
            segundoNombre: '',
            primerApellido: '',
            segundoApellido: '',
            fechaNacimiento: ''

          });

          this.form.get('primerNombre')?.enable();
          this.form.get('segundoNombre')?.enable();
          this.form.get('primerApellido')?.enable();
          this.form.get('segundoApellido')?.enable();
          this.form.get('fechaNacimiento')?.enable();

        }

      });

  }

  guardarIngreso() {

    const request = {

      numeroIngreso: this.form.get('numeroIngreso')?.value,
      epsId: Number(this.form.get('epsId')?.value),

      tipoDocumento: this.form.get('tipoDocumento')?.value,
      numeroDocumento: this.form.get('numeroDocumento')?.value,

      primerNombre: this.form.get('primerNombre')?.value,
      segundoNombre: this.form.get('segundoNombre')?.value,

      primerApellido: this.form.get('primerApellido')?.value,
      segundoApellido: this.form.get('segundoApellido')?.value,

      fechaNacimiento: this.form.get('fechaNacimiento')?.value,
      sexo: this.form.get('sexo')?.value,

      usuario: 'FACTURADOR01',
      rolUsuario: 'FACTURADOR'

    };

    this.ingresoService.crearIngreso(request)
      .subscribe({

        next: (response) => {

          this.snackBar.open('Ingreso creado correctamente', 'Cerrar', {
            duration: 3000
          });

          this.form.reset();
          this.epsControl.setValue('');
          this.epsSeleccionada = null;
          this.epsFiltradas = this.epsList;

          this.pacienteExiste = false;

        },

        error: (error) => {

          const mensaje =
            error?.error?.mensaje || 'Error al crear el ingreso';

          this.snackBar.open(mensaje, 'Cerrar', {
            duration: 5000
          });

        }

      });

  }

  calcularEdad() {

    this.validarTipoDocumentoPorEdad();

    const fecha = this.form.get('fechaNacimiento')?.value;
    if (!fecha) return;

    const nacimiento = new Date(fecha);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (
      mes < 0 ||
      (mes === 0 && hoy.getDate() < nacimiento.getDate())
    ) {
      edad--;
    }

    this.form.patchValue({
      edad: edad.toString()
    });

  }

  soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  soloLetras(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(char)) {
      event.preventDefault();
    }
  }



   filtrarEps(value: string | any) {

     const filtro = (value || '').toString().toLowerCase();

     this.epsFiltradas = this.epsList.filter(eps =>
       eps.nombre.toLowerCase().includes(filtro) ||
       (eps.codigo?.toLowerCase().includes(filtro))
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


  validarTipoDocumentoPorEdad() {

    const edad = Number(this.form.get('edad')?.value);
    const tipo = this.form.get('tipoDocumento')?.value;

    if (!tipo) {
      return;
    }

    if (edad < 7 && tipo !== 'RC') {

      this.form.get('tipoDocumento')?.setErrors({
        edadDocumento: true
      });

    }

    else if (edad >= 7 &&edad < 18 &&tipo !== 'TI') {
      this.form.get('tipoDocumento')?.setErrors({
        edadDocumento: true
      });

    }

    else if (
      edad >= 18 &&  tipo !== 'CC') {
      this.form.get('tipoDocumento')?.setErrors({
        edadDocumento: true
      });

    }

  }

}
