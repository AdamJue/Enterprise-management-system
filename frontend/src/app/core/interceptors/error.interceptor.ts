import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '发生未知错误';

      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || '请求参数错误';
          break;
        case 401:
          errorMessage = '未授权访问，请重新登录';
          authService.logout();
          break;
        case 403:
          errorMessage = '权限不足，无法访问该资源';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 422:
          errorMessage = '数据验证失败';
          break;
        case 429:
          errorMessage = '请求过于频繁，请稍后再试';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        case 502:
          errorMessage = '网关错误';
          break;
        case 503:
          errorMessage = '服务暂时不可用';
          break;
        case 0:
          errorMessage = '网络连接失败，请检查网络设置';
          break;
        default:
          errorMessage = error.error?.message || `HTTP错误 ${error.status}`;
      }

      // Show error notification
      notificationService.error('请求失败', errorMessage);

      // Log error for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: error.url,
        error: error.error
      });

      return throwError(() => error);
    })
  );
}; 