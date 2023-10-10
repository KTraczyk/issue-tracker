import { ParameterizedContext, Next } from 'koa';

export class StandardError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message);
  }
}

type ValidationError = Error & {
  location: {
    in: string;
  };
  suggestions: Array<{ error: string }>;
};

function isValidationError(error: unknown): error is ValidationError {
  return (
    error instanceof Error &&
    'location' in error &&
    typeof error.location === 'object' &&
    error.location !== null &&
    'in' in error.location &&
    typeof error.location.in === 'string' &&
    'suggestions' in error &&
    Array.isArray(error.suggestions) &&
    error.suggestions.every((suggestion) => 'error' in suggestion && typeof suggestion.error === 'string')
  );
}

function createErrorMiddleware() {
  return async function errorMiddleware(ctx: ParameterizedContext, next: Next) {
    try {
      await next();
    } catch (e) {
      if (e instanceof StandardError) {
        ctx.status = e.code;
        ctx.body = {
          error: e.message,
        };
        return;
      }
      if (isValidationError(e)) {
        ctx.status = 400;
        ctx.body = {
          error: `${e.message}: ${e.location.in} ${e.suggestions
            .map((suggestion) => suggestion.error.trim())
            .join(' ')}`,
        };
        return;
      }
      const error = e instanceof Error ? e.message : 'Unknown error';
      ctx.status = 500;
      ctx.body = {
        error,
      };
    }
  };
}

export { createErrorMiddleware };
