import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-documento-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './documento-item.component.html',
  styleUrls: ['./documento-item.component.css']
})
export class DocumentoItemComponent {

  @Input() documento: any;

  @Output() descargar = new EventEmitter<void>();
}