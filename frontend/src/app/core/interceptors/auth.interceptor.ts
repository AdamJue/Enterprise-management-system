import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // Skip auth for login and register endpoints
  const skipAuth = req.url.includes('/auth/login') || 
                   req.url.includes('/auth/register') ||
                   req.url.includes('/auth/refresh');

  if (token && !skipAuth) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
}; 