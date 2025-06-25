export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  appName: '企业管理系统',
  version: '1.0.0',
  features: {
    enableAnalytics: false,
    enableLogging: true,
    enableMockData: true
  },
  auth: {
    tokenKey: 'ems_access_token',
    refreshTokenKey: 'ems_refresh_token',
    tokenExpiration: 3600000 // 1 hour in milliseconds
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100]
  }
}; 