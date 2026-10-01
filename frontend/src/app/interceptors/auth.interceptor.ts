import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }}) : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        localStorage.clear();
        router.navigate(['/']); // Redireciona para login ao expirar
      }
      return throwError(() => err);
    })
  );
};