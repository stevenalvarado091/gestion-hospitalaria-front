import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
selector: 'app-modulo-layout',
standalone: true,
imports: [CommonModule],
template: `
  <div class="app-module">

    <div class="app-card app-section">

      <div class="app-module-header">

        <div>
          <h2>{{ titulo }}</h2>
          <p>{{ subtitulo }}</p>
        </div>

        <div class="app-actions">
          <ng-content select="[acciones]"></ng-content>
        </div>

      </div>

      <ng-content></ng-content>

    </div>

  </div>
`
})
export class ModuloLayoutComponent {

@Input() titulo = '';
@Input() subtitulo = '';

}
