export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errorCode?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = '未授权访问') {
    super(401, message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = '没有操作权限') {
    super(403, message, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource}不存在`, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export const errorHandler = (error: any) => {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
        details: error.details
      }
    };
  }

  // 处理 Prisma 错误
  if (error.code && error.code.startsWith('P')) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '数据库操作失败',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
    };
  }

  // 未知错误
  console.error('Unhandled error:', error);
  return {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '服务器内部错误'
    }
  };
}; 