import { Routes } from '@angular/router';

import { IngresosComponent } from './features/ingresos/ingresos';
import { NuevoIngresoComponent } from './features/nuevo-ingreso/nuevo-ingreso';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'ingresos',
    pathMatch: 'full'
  },

  {
    path: 'ingresos',
    loadComponent: () =>
      import('./features/ingresos/ingresos')
        .then(m => m.IngresosComponent)
  },

  {
    path: 'nuevo-ingreso',
    loadComponent: () =>
      import('./features/nuevo-ingreso/nuevo-ingreso')
        .then(m => m.NuevoIngresoComponent)
  },

  {
    path: 'ingresos/:id',
    loadComponent: () =>
      import('./features/ingreso-detalle/ingreso-detalle')
        .then(m => m.IngresoDetalleComponent),

    children: [

      {
        path: '',
        redirectTo: 'resumen',
        pathMatch: 'full'
      },

      {
        path: 'resumen',
        loadComponent: () =>
          import('./features/ingreso-resumen/ingreso-resumen')
            .then(m => m.IngresoResumenComponent)
      },

      {
        path: 'observaciones',
        loadComponent: () =>
          import('./features/ingreso-observaciones/ingreso-observaciones')
            .then(m => m.IngresoObservacionesComponent)
      },

      {
        path: 'autorizaciones',
        loadComponent: () =>
          import('./features/ingreso-autorizaciones/ingreso-autorizaciones')
            .then(m => m.IngresoAutorizacionesComponent)
      },

      {
        path: 'correos',
        loadComponent: () =>
          import('./features/ingreso-correos/ingreso-correos')
            .then(m => m.IngresoCorreosComponent)
      },

      {
        path: 'documentos',
        loadComponent: () =>
          import('./features/ingreso-documentos/ingreso-documentos')
            .then(m => m.IngresoDocumentosComponent)
      }

    ]
  }

];
