import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IngresoService } from '../../core/services/ingreso.service';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';
import { AutorizacionService } from '../../core/services/autorizacion.service';
import { CorreoService } from '../../core/services/correo.service';
import { DocumentoService } from '../../core/services/documento.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-ingreso-resumen',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './ingreso-resumen.html',
  styleUrls: ['./ingreso-resumen.css']
})


export class IngresoResumenComponent implements OnInit {

  ingresoId!: number;
  ingreso: any;

  timeline: any[] = [];
  eventos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingresoService: IngresoService,
    private correoService: CorreoService,
    private autorizacionService: AutorizacionService,
    private documentoService: DocumentoService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient

  ) { }

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
          remitente: c.remitente,
          destinatarios: c.destinatario
            ? c.destinatario.split(',').map((x: string) => x.trim())
            : [],
          adjuntos: c.adjuntos || [],

          envios: (c.envios || []).sort((a: any, b: any) => {

            const fechaA = a.fechaEjecutada ?? a.fechaProgramada;
            const fechaB = b.fechaEjecutada ?? b.fechaProgramada;

            return new Date(fechaA).getTime() - new Date(fechaB).getTime();

          })
            .map((e: any) => ({

              ...e,

              estadoVisual: e.fechaEjecutada
                ? 'ENVIADO'
                : e.estado,

              expandido: false

            }))

        },

        expandido: false
      });

    });

    this.ingreso.autorizaciones?.forEach((a: any) => {

      let descripcion = '';

      if (a.numeroAutorizacion) {
        descripcion = a.numeroAutorizacion;
      }
      else if (a.nombreArchivo) {
        descripcion = a.nombreArchivo;
      }
      else if (a.observacion) {
        descripcion = a.observacion;
      }
      else {
        descripcion = 'Autorización';
      }

      this.eventos.push({

        tipo: 'AUTORIZACION',

        fecha: a.fechaCreacion,

        usuario: a.usuario,

        descripcion: descripcion,

        detalle: a,

        expandido: false

      });

    });;

    this.eventos.sort((a, b) =>
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    this.timeline = this.eventos;
  }

  toggleEvento(evento: any) {
    evento.expandido = !evento.expandido;
  }

  toggleEnvio(envio: any) {
    envio.expandido = !envio.expandido;
  }

  getTipoClase(tipo: string): string {
    return tipo ? tipo.toLowerCase().trim() : '';
  }

  volverAIngresos() {
    this.router.navigate(['/ingresos']);
  }


  descargarAutorizacion(id: number, nombre: string) {

  this.autorizacionService
    .descargar(id)
    .subscribe({

      next: (archivo: Blob) => {

        const url = window.URL.createObjectURL(archivo);

        const enlace = document.createElement('a');

        enlace.href = url;
        enlace.download = nombre;
        enlace.click();

        window.URL.revokeObjectURL(url);

      },

      error: (err) => {
        console.error('Error descargando autorización', err);
      }

    });
}

  descargarAdjunto(id: number) {

    console.log("ID enviado:", id);

    this.correoService.descargarAdjunto(id);

  }

  descargarDocumento(id: number, nombre: string) {

    this.documentoService
      .descargar(id)
      .subscribe({

        next: (archivo: Blob) => {

          const url = window.URL.createObjectURL(archivo);

          const enlace = document.createElement('a');

          enlace.href = url;

          enlace.download = nombre;

          enlace.click();

          window.URL.revokeObjectURL(url);

        },

        error: (err) => {

          console.error(
            'Error descargando documento',
            err
          );

        }

      });

  }


  abrirAdjunto(id: number): void {

  this.correoService.abrirAdjunto(id).subscribe({

    next: (archivo: Blob) => {

      const url = window.URL.createObjectURL(archivo);

      // abre el PDF en una nueva pestaña
      window.open(url, '_blank');

      // libera memoria
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    },

    error: (err) => {
      console.error('Error abriendo adjunto', err);
    }
  });
}


  imprimirCorreo(evento: any, imprimir: boolean = true): void {

    evento.imprimiendo = true;

    // Fuerza que todos los envíos se muestren temporalmente
    if (evento.detalle.envios?.length) {
      evento.detalle.envios.forEach((envio: any) => envio.expandido = true);
    }

    setTimeout(() => {

      const elemento = document.getElementById(`correo-${evento.id}`);

      if (!elemento) {
        evento.imprimiendo = false;
        return;
      }

      // Clonamos el contenido para quitar los iconos de acción
      const clon = elemento.cloneNode(true) as HTMLElement;

      // Quitar elementos del timeline que no deben verse en impresión
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
        evento.imprimiendo = false;
        return;
      }

      const ventana = window.open('', '_blank', 'width=1100,height=900');

      if (!ventana) {
        evento.imprimiendo = false;
        return;
      }

      ventana.document.write(`
      <html>
        <head>
          <title>${evento.detalle.asunto}</title>
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

            .envio-header{
              padding:16px 20px;
              background:#f8fafc;
              border-bottom:1px solid #e5e7eb;
              font-weight:600;
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
      if (evento.detalle.envios?.length) {
        evento.detalle.envios.forEach((envio: any) => envio.expandido = false);
      }

      evento.imprimiendo = false;

    }, 0);
  }


  abrirCorreoVentana(evento: any): void {
    this.imprimirCorreo(evento, false);
  }


}

