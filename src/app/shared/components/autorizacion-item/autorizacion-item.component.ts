import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-autorizacion-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './autorizacion-item.component.html',
  styleUrls: ['./autorizacion-item.component.css']
})
export class AutorizacionItemComponent {

  @Input() autorizacion: any;

  @Output() descargar = new EventEmitter<void>();
}