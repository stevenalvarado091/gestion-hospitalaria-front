import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (solicitudHttp, siguiente) => {

  const servicioAutenticacion = inject(AuthService);

  const tokenAutenticacion = servicioAutenticacion.getToken();

  if (!tokenAutenticacion) {
    return siguiente(solicitudHttp);
  }

  const solicitudConAutenticacion = solicitudHttp.clone({

    setHeaders: {
      Authorization: `Bearer ${tokenAutenticacion}`
    }

  });

  return siguiente(solicitudConAutenticacion);

};