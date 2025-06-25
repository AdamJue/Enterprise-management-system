import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-list-container">
      <h1>订单管理</h1>
      <p>订单管理功能开发中...</p>
    </div>
  `,
  styles: [`
    .order-list-container {
      padding: 2rem;
    }
  `]
})
export class OrderListComponent {} 