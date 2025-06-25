import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  // 默认重定向到仪表板
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // 认证模块（登录、注册等）
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  
  // 仪表板（需要认证）
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
  },
  
  // 用户管理模块
  {
    path: 'users',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['user:read'] },
    loadChildren: () => import('./features/user/user.routes').then(m => m.userRoutes)
  },
  
  // 订单管理模块
  {
    path: 'orders',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['order:read'] },
    loadChildren: () => import('./features/order/order.routes').then(m => m.orderRoutes)
  },
  
  // 系统管理模块
  {
    path: 'admin',
    canActivate: [authGuard, permissionGuard],
    data: { roles: ['admin', 'super_admin'] },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  
  // 404页面
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
