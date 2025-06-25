import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-list-container">
      <h1>用户管理</h1>
      <p>用户管理功能开发中...</p>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 2rem;
    }
  `]
})
export class UserListComponent {} 