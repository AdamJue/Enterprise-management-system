import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">仪表板</h1>
        <p class="dashboard-subtitle" *ngIf="currentUser">
          欢迎回来，{{ currentUser.firstName }} {{ currentUser.lastName }}
        </p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon users">
            <i class="icon">👥</i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalUsers }}</h3>
            <p class="stat-label">总用户数</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon orders">
            <i class="icon">📋</i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalOrders }}</h3>
            <p class="stat-label">总订单数</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon revenue">
            <i class="icon">💰</i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">¥{{ stats.totalRevenue | number:'1.0-0' }}</h3>
            <p class="stat-label">总收入</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon tasks">
            <i class="icon">✅</i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.completedTasks }}</h3>
            <p class="stat-label">已完成任务</p>
          </div>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="content-grid">
          <div class="card recent-activities">
            <div class="card-header">
              <h3 class="card-title">最近活动</h3>
            </div>
            <div class="card-body">
              <div class="activity-list">
                <div class="activity-item" *ngFor="let activity of recentActivities">
                  <div class="activity-icon">
                    <i class="icon">{{ activity.icon }}</i>
                  </div>
                  <div class="activity-content">
                    <p class="activity-text">{{ activity.description }}</p>
                    <span class="activity-time">{{ activity.timestamp | date:'short' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card quick-actions">
            <div class="card-header">
              <h3 class="card-title">快速操作</h3>
            </div>
            <div class="card-body">
              <div class="action-grid">
                <button class="action-btn" routerLink="/users">
                  <i class="icon">👥</i>
                  <span>用户管理</span>
                </button>
                <button class="action-btn" routerLink="/orders">
                  <i class="icon">📋</i>
                  <span>订单管理</span>
                </button>
                <button class="action-btn" routerLink="/admin" *ngIf="hasAdminAccess">
                  <i class="icon">⚙️</i>
                  <span>系统设置</span>
                </button>
                <button class="action-btn" (click)="refreshData()">
                  <i class="icon">🔄</i>
                  <span>刷新数据</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
    }
    
    .dashboard-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 0.5rem 0;
    }
    
    .dashboard-subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      font-size: 1.5rem;
    }
    
    .stat-icon.users { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.orders { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.revenue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.tasks { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    
    .stat-content {
      flex: 1;
    }
    
    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 0.25rem 0;
    }
    
    .stat-label {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .card-header {
      padding: 1.5rem 1.5rem 0 1.5rem;
    }
    
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .activity-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .activity-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .activity-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .activity-icon {
      width: 40px;
      height: 40px;
      background: #f8f9fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    .activity-content {
      flex: 1;
    }
    
    .activity-text {
      color: #333;
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }
    
    .activity-time {
      color: #666;
      font-size: 0.8rem;
    }
    
    .action-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: #333;
    }
    
    .action-btn:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
    
    .action-btn .icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    .action-btn span {
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .icon {
      display: inline-block;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  hasAdminAccess = false;
  
  stats = {
    totalUsers: 1250,
    totalOrders: 3847,
    totalRevenue: 128500,
    completedTasks: 892
  };
  
  recentActivities = [
    {
      icon: '👤',
      description: '新用户 张三 注册了账户',
      timestamp: new Date(Date.now() - 10 * 60000)
    },
    {
      icon: '📋',
      description: '订单 #12345 已完成',
      timestamp: new Date(Date.now() - 25 * 60000)
    },
    {
      icon: '✅',
      description: '审批流程 "员工入职" 已通过',
      timestamp: new Date(Date.now() - 45 * 60000)
    },
    {
      icon: '💰',
      description: '收到付款 ¥5,200',
      timestamp: new Date(Date.now() - 60 * 60000)
    },
    {
      icon: '⚙️',
      description: '系统配置已更新',
      timestamp: new Date(Date.now() - 90 * 60000)
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.hasAdminAccess = this.authService.hasRole('admin') || this.authService.hasRole('super_admin');
  }

  refreshData(): void {
    // 模拟数据刷新
    console.log('刷新数据...');
    // 这里可以调用实际的API来刷新数据
  }
} 