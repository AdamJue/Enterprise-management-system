import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h1>用户注册</h1>
        <p>注册功能开发中...</p>
        <a routerLink="/auth/login" class="back-link">返回登录</a>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .register-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
    }
    .back-link {
      color: #667eea;
      text-decoration: none;
    }
  `]
})
export class RegisterComponent {} 