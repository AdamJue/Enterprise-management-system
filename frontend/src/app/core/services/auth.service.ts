import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  ChangePasswordRequest,
  LoginResponse
} from '../models/user.model';
import { ApiResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = environment.auth.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.auth.refreshTokenKey;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getAccessToken();
      const user = this.getCurrentUserFromStorage();
      
      if (token && user) {
        this.setCurrentUser(user);
        this.setAuthenticated(true);
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        map(response => {
          // 处理后端返回的响应格式
          return {
            accessToken: response.access_token,
            refreshToken: response.access_token, // 临时使用access_token作为refresh_token
            tokenType: response.token_type || 'Bearer',
            expiresIn: response.expires_in || 3600,
            user: response.user
          } as AuthResponse;
        }),
        tap(authResponse => {
          this.handleAuthSuccess(authResponse);
        }),
        catchError(error => {
          console.error('Login error:', error);
          let errorMessage = '登录失败，请稍后重试';
          if (error.status === 401) {
            errorMessage = '用户名或密码错误';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          return throwError(() => ({ ...error, message: errorMessage }));
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        map(response => response.data),
        tap(authResponse => {
          this.handleAuthSuccess(authResponse);
        }),
        catchError(error => {
          console.error('Register error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    // Call logout API
    this.http.post(`${this.API_URL}/auth/logout`, {}).subscribe({
      complete: () => {
        this.handleLogout();
      },
      error: () => {
        // Even if API call fails, clear local data
        this.handleLogout();
      }
    });
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/auth/refresh`, {
      refreshToken
    }).pipe(
      map(response => response.data),
      tap(authResponse => {
        this.handleAuthSuccess(authResponse);
      }),
      catchError(error => {
        this.handleLogout();
        return throwError(() => error);
      })
    );
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/auth/change-password`, passwordData)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Change password error:', error);
          return throwError(() => error);
        })
      );
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;

    return user.roles.some(role => 
      role.permissions.some(p => p.code === permission)
    );
  }

  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;

    return user.roles.some(role => role.code === roleName);
  }

  private handleAuthSuccess(authResponse: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      // Store tokens
      localStorage.setItem(this.TOKEN_KEY, authResponse.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
      
      // Store user data
      localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
    }
    
    // Update observables
    this.setCurrentUser(authResponse.user);
    this.setAuthenticated(true);
  }

  private handleLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Clear storage
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem('currentUser');
    }
    
    // Update observables
    this.setCurrentUser(null);
    this.setAuthenticated(false);
    
    // Redirect to login
    this.router.navigate(['/auth/login']);
  }

  private getCurrentUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        try {
          return JSON.parse(userJson);
        } catch (error) {
          console.error('Error parsing user data from storage:', error);
          return null;
        }
      }
    }
    return null;
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  private setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
} 