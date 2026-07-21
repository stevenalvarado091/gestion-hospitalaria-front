import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (solicitudHttp, siguiente) => {

  const servicioAutenticacion = inject(AuthService);

  const tokenAutenticacion = servicioAutenticacion.getToken();

  let solicitud = solicitudHttp;

  if (tokenAutenticacion) {

    solicitud = solicitudHttp.clone({

      setHeaders: {

        Authorization: `Bearer ${tokenAutenticacion}`

      }

    });

  }

  return siguiente(solicitud).pipe(

    catchError(error => {

      if (error.status === 401) {

        servicioAutenticacion.logout(true);

      }

      return throwError(() => error);

    })

  );

};