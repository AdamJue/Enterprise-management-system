import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingState } from '../../../core/models/common.model';
import { LoginRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">企业管理系统</h1>
          <p class="login-subtitle">欢迎回来，请登录您的账户</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              class="form-input"
              [class.error]="isFieldInvalid('username')"
              placeholder="请输入用户名"
            />
            <div class="error-message" *ngIf="isFieldInvalid('username')">
              <span *ngIf="loginForm.get('username')?.errors?.['required']">用户名不能为空</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-input"
              [class.error]="isFieldInvalid('password')"
              placeholder="请输入密码"
            />
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">密码不能为空</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">密码至少6位字符</span>
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe" class="checkbox" />
              <span class="checkmark"></span>
              记住我
            </label>
          </div>
          
          <button
            type="submit"
            class="login-button"
            [disabled]="loginForm.invalid || loadingState === 'loading'"
            [class.loading]="loadingState === 'loading'"
          >
            <span *ngIf="loadingState !== 'loading'">登录</span>
            <span *ngIf="loadingState === 'loading'" class="loading-spinner">
              <i class="spinner"></i> 登录中...
            </span>
          </button>
        </form>
        
        <div class="login-footer">
          <a href="#" class="forgot-password">忘记密码？</a>
          <div class="register-link">
            还没有账户？ <a routerLink="/auth/register" class="register-text">立即注册</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }
    
    .login-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .login-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 0.5rem 0;
    }
    
    .login-subtitle {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
      font-size: 0.9rem;
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-input.error {
      border-color: #e74c3c;
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.9rem;
      color: #666;
    }
    
    .checkbox {
      margin-right: 0.5rem;
    }
    
    .login-button {
      width: 100%;
      padding: 0.875rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 1.5rem;
    }
    
    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .login-footer {
      text-align: center;
    }
    
    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    .forgot-password:hover {
      text-decoration: underline;
    }
    
    .register-link {
      color: #666;
      font-size: 0.9rem;
    }
    
    .register-text {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    
    .register-text:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loadingState: LoadingState = LoadingState.IDLE;
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // 获取返回URL
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // 如果已经登录，直接跳转
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loadingState = LoadingState.LOADING;
    
    const credentials: LoginRequest = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
      rememberMe: this.loginForm.get('rememberMe')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loadingState = LoadingState.SUCCESS;
        this.notificationService.success('登录成功', '欢迎回来！');
        
        // 延迟导航以显示成功消息
        setTimeout(() => {
          this.router.navigate([this.returnUrl]);
        }, 1000);
      },
      error: (error) => {
        this.loadingState = LoadingState.ERROR;
        console.error('Login failed:', error);
        
        let errorMessage = '登录失败，请稍后重试';
        if (error.status === 401) {
          errorMessage = '用户名或密码错误，请检查后重试';
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.notificationService.error('登录失败', errorMessage);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
} 