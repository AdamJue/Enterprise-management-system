import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard-container">
      <h1>系统管理</h1>
      <p>系统管理功能开发中...</p>
    </div>
  `,
  styles: [`
    .admin-dashboard-container {
      padding: 2rem;
    }
  `]
})
export class AdminDashboardComponent {} 