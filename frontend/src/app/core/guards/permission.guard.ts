import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  // Get required permissions from route data
  const requiredPermissions = route.data?.['permissions'] as string[];
  const requiredRoles = route.data?.['roles'] as string[];

  if (!requiredPermissions && !requiredRoles) {
    // No specific permissions required
    return true;
  }

  // Check permissions
  if (requiredPermissions) {
    const hasPermission = requiredPermissions.some(permission => 
      authService.hasPermission(permission)
    );
    
    if (!hasPermission) {
      notificationService.error('访问被拒绝', '您没有访问此页面的权限');
      router.navigate(['/dashboard']);
      return false;
    }
  }

  // Check roles
  if (requiredRoles) {
    const hasRole = requiredRoles.some(role => 
      authService.hasRole(role)
    );
    
    if (!hasRole) {
      notificationService.error('访问被拒绝', '您的角色无权访问此页面');
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
}; 