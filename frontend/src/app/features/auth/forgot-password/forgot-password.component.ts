import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <h1>忘记密码</h1>
        <p>密码重置功能开发中...</p>
        <a routerLink="/auth/login" class="back-link">返回登录</a>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .forgot-password-card {
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
export class ForgotPasswordComponent {} 