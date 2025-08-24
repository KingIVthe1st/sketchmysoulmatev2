// Error handling utilities and custom error classes
export interface ErrorContext {
  operation?: string;
  userId?: string;
  requestId?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface ElevenLabsError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorCode?: string;
  context?: ErrorContext;
}

export class CustomError extends Error implements ElevenLabsError {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode?: string;
  public readonly context?: ErrorContext;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    errorCode?: string,
    context?: ErrorContext
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;
    this.context = context;

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 400, true, 'VALIDATION_ERROR', context);
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string, context?: ErrorContext) {
    super(`${resource} not found`, 404, true, 'NOT_FOUND', context);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized access', context?: ErrorContext) {
    super(message, 401, true, 'UNAUTHORIZED', context);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Access forbidden', context?: ErrorContext) {
    super(message, 403, true, 'FORBIDDEN', context);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 409, true, 'CONFLICT', context);
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Rate limit exceeded', context?: ErrorContext) {
    super(message, 429, true, 'RATE_LIMIT', context);
  }
}

export class ExternalServiceError extends CustomError {
  constructor(service: string, message: string, context?: ErrorContext) {
    super(
      `${service} service error: ${message}`,
      502,
      true,
      'EXTERNAL_SERVICE_ERROR',
      { ...context, service }
    );
  }
}

export class ElevenLabsServiceError extends ExternalServiceError {
  constructor(message: string, context?: ErrorContext) {
    super('ElevenLabs', message, context);
  }
}

export class DatabaseError extends CustomError {
  constructor(operation: string, message: string, context?: ErrorContext) {
    super(
      `Database error during ${operation}: ${message}`,
      500,
      false,
      'DATABASE_ERROR',
      { ...context, operation }
    );
  }
}

export class ConfigurationError extends CustomError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 500, false, 'CONFIGURATION_ERROR', context);
  }
}

export class ErrorHandler {
  private static isOperationalError(error: Error): boolean {
    if (error instanceof CustomError) {
      return error.isOperational;
    }
    return false;
  }

  static handle(error: Error, context?: ErrorContext): ElevenLabsError {
    // Log the error
    console.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });

    // If it's already a custom error, return it
    if (this.isCustomError(error)) {
      return error as ElevenLabsError;
    }

    // Convert unknown errors to operational errors
    if (this.isOperationalError(error)) {
      return new CustomError(
        error.message,
        500,
        true,
        'UNKNOWN_ERROR',
        context
      );
    }

    // For programming errors, don't leak details
    return new CustomError(
      'An unexpected error occurred',
      500,
      false,
      'PROGRAMMING_ERROR',
      context
    );
  }

  static isCustomError(error: Error): error is ElevenLabsError {
    return error instanceof CustomError;
  }

  static createErrorContext(
    operation?: string,
    userId?: string,
    requestId?: string,
    metadata?: Record<string, any>
  ): ErrorContext {
    return {
      operation,
      userId,
      requestId,
      timestamp: new Date(),
      metadata
    };
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: ErrorContext
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw this.handle(error as Error, context);
    }
  }

  static logError(error: ElevenLabsError): void {
    const logLevel = error.isOperational ? 'warn' : 'error';

    console[logLevel]({
      message: error.message,
      statusCode: error.statusCode,
      errorCode: error.errorCode,
      isOperational: error.isOperational,
      context: error.context,
      stack: error.stack
    });
  }

  static getErrorResponse(error: ElevenLabsError): {
    statusCode: number;
    error: {
      message: string;
      code?: string;
      details?: any;
    };
  } {
    return {
      statusCode: error.statusCode,
      error: {
        message: error.message,
        code: error.errorCode,
        details: error.context?.metadata
      }
    };
  }
}

// Utility function for retry logic with exponential backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000,
  context?: ErrorContext
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        break;
      }

      // Check if error is retryable
      const retryCondition = (err: Error): boolean => {
        if (err instanceof RateLimitError) return true;
        if (err instanceof ExternalServiceError) return true;
        if (err instanceof CustomError && err.statusCode >= 500) return true;
        return false;
      };

      if (!retryCondition(lastError)) {
        throw ErrorHandler.handle(lastError, context);
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw ErrorHandler.handle(lastError!, context);
}

// Input validation utilities
export class ValidationUtils {
  static validateRequired(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${fieldName} is required`);
    }
  }

  static validateString(value: any, fieldName: string, minLength?: number, maxLength?: number): string {
    if (typeof value !== 'string') {
      throw new ValidationError(`${fieldName} must be a string`);
    }

    if (minLength && value.length < minLength) {
      throw new ValidationError(`${fieldName} must be at least ${minLength} characters`);
    }

    if (maxLength && value.length > maxLength) {
      throw new ValidationError(`${fieldName} must be no more than ${maxLength} characters`);
    }

    return value.trim();
  }

  static validateNumber(value: any, fieldName: string, min?: number, max?: number): number {
    const num = Number(value);
    if (isNaN(num)) {
      throw new ValidationError(`${fieldName} must be a valid number`);
    }

    if (min !== undefined && num < min) {
      throw new ValidationError(`${fieldName} must be at least ${min}`);
    }

    if (max !== undefined && num > max) {
      throw new ValidationError(`${fieldName} must be no more than ${max}`);
    }

    return num;
  }

  static validateEnum<T>(value: any, allowedValues: T[], fieldName: string): T {
    if (!allowedValues.includes(value)) {
      throw new ValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }
    return value;
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>\"']/g, '')
      .trim()
      .substring(0, 1000); // Limit length
  }
}