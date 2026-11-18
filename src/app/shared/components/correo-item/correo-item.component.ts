import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-correo-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './correo-item.component.html',
  styleUrls: ['./correo-item.component.css']
})
export class CorreoItemComponent {

  @Input() correo: any;
  @Input() expandido = false;

  @Output() toggle = new EventEmitter<void>();
  @Output() toggleEnvio = new EventEmitter<any>();
  @Output() imprimir = new EventEmitter<any>();
  @Output() abrirVentana = new EventEmitter<any>();
  @Output() descargarAdjunto = new EventEmitter<{ id: number, nombre: string }>();
}