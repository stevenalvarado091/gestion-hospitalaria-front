import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IngresoService } from '../../core/services/ingreso';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-ingreso-resumen',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './ingreso-resumen.html',
  styleUrls: ['./ingreso-resumen.css']
})


export class IngresoResumenComponent implements OnInit{

  ingresoId!: number;
  ingreso: any;

  timeline: any[] = [];
  eventos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingresoService: IngresoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/ingresos']);
      return;
    }

    this.ingresoId = Number(id);
    this.cargarIngreso();
  }

  cargarIngreso() {
    this.ingresoService.getDetalle(this.ingresoId).subscribe({
      next: (data: any) => {
        this.ingreso = data;

        this.construirTimeline();
        this.cdr.detectChanges();

      }
    });
  }

  construirTimeline() {

    this.eventos = [];

    this.ingreso.observaciones?.forEach((o: any) => {
      this.eventos.push({
        tipo: 'OBSERVACION',
        fecha: o.fechaCreacion,
        usuario: o.usuario,
        descripcion: o.descripcion,
        detalle: o,
        expandido: false
      });
    });

    this.ingreso.documentos?.forEach((d: any) => {
      this.eventos.push({
        tipo: 'DOCUMENTO',
        fecha: d.fechaCreacion,
        usuario: d.usuario,
        descripcion: d.nombre,
        detalle: d,
        expandido: false
      });
    });

    this.ingreso.correos?.forEach((c: any) => {

        console.log('CORREO', c.id);
        console.log('ADJUNTOS', c.adjuntos);

      this.eventos.push({

        tipo: 'CORREO',
        fecha: c.fechaCreacion,
        usuario: c.usuario,
        descripcion: c.asunto,

        detalle: {
          asunto: c.asunto,
          mensaje: c.mensaje,
          destinatarios: c.destinatario
              ? c.destinatario.split(',').map((x: string) => x.trim())
              : [],
          adjuntos: c.adjuntos || [],
          envios: c.envios || []
        },

        expandido: false
      });

    });

    this.ingreso.autorizaciones?.forEach((a: any) => {
      this.eventos.push({
        tipo: 'AUTORIZACION',
        fecha: a.fechaCreacion,
        usuario: a.usuario,
        descripcion: a.asunto,
        detalle: a,
        expandido: false
      });
    });

    this.eventos.sort((a, b) =>
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    this.timeline = this.eventos;
  }

  toggleEvento(evento: any) {
    evento.expandido = !evento.expandido;
  }

  getTipoClase(tipo: string): string {
    return tipo ? tipo.toLowerCase().trim() : '';
  }

  volverAIngresos() {
    this.router.navigate(['/ingresos']);
  }
}

