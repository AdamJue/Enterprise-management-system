import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">页面未找到</h2>
        <p class="error-message">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div class="error-actions">
          <button class="btn btn-primary" routerLink="/dashboard">
            返回首页
          </button>
          <button class="btn btn-secondary" (click)="goBack()">
            返回上页
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .not-found-content {
      text-align: center;
      padding: 2rem;
    }
    
    .error-code {
      font-size: 8rem;
      font-weight: bold;
      margin: 0;
      opacity: 0.8;
    }
    
    .error-title {
      font-size: 2rem;
      margin: 1rem 0;
    }
    
    .error-message {
      font-size: 1.2rem;
      margin: 1.5rem 0;
      opacity: 0.9;
    }
    
    .error-actions {
      margin-top: 2rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      margin: 0 0.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }
    
    .btn-primary {
      background: #4CAF50;
      color: white;
    }
    
    .btn-primary:hover {
      background: #45a049;
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }
    
    .btn-secondary:hover {
      background: white;
      color: #667eea;
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
} 