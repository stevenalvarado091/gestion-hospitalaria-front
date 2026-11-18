import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-observacion-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './observacion-item.component.html',
  styleUrls: ['./observacion-item.component.css']
})
export class ObservacionItemComponent {

  @Input() observacion: any;
  @Input() expandido = false;

  @Output() toggle = new EventEmitter<void>();
}

