import { createErrorMiddleware, StandardError } from '../../src/middlewares';
import { createMockContext } from '@shopify/jest-koa-mocks';

describe('Error middleware', () => {
  it('should return status code 500 and error with error message if there were unhandled errors', async () => {
    const errorMiddleware = createErrorMiddleware();
    const ctx = createMockContext();
    const nextMock = jest.fn().mockRejectedValueOnce(new Error('rejected'));

    await errorMiddleware(ctx, nextMock);

    expect(nextMock).toBeCalled();
    expect(ctx.status).toBe(500);
    expect(ctx.body).toEqual({
      error: 'rejected',
    });
  });

  it('should return status code 500 and error with message Unknown error if thrown value is not an error', async () => {
    const errorMiddleware = createErrorMiddleware();
    const ctx = createMockContext();
    const nextMock = jest.fn().mockRejectedValueOnce('test');

    await errorMiddleware(ctx, nextMock);

    expect(nextMock).toBeCalled();
    expect(ctx.status).toBe(500);
    expect(ctx.body).toEqual({
      error: 'Unknown error',
    });
  });

  it('should return status code and message from Standard Error if it was thrown', async () => {
    const errorMiddleware = createErrorMiddleware();
    const ctx = createMockContext({});
    const nextMock = jest.fn().mockRejectedValue(new StandardError('test', 400));

    await errorMiddleware(ctx, nextMock);

    expect(nextMock).toBeCalled();
    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({
      error: 'test',
    });
  });

  it('should return status code 400 detailed message if thrown error is ValidationError', async () => {
    const errorMiddleware = createErrorMiddleware();
    const ctx = createMockContext({});
    class ValidationError extends Error {
      public location = {
        in: "request-body",
      };
      public suggestions = [
        {
          error: "must have required property 'description'"
        }
      ]
      constructor(
        message: string,
      ) {
        super(message);
      }
    }
    const validationError = new ValidationError("RequestValidationError: Schema validation error");
    const nextMock = jest.fn().mockRejectedValue(validationError);

    await errorMiddleware(ctx, nextMock);

    expect(nextMock).toBeCalled();
    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({
      error: 'RequestValidationError: Schema validation error: request-body must have required property \'description\'',
    });
  });

  it('should not do anything if no error was thrown', async () => {
    const errorMiddleware = createErrorMiddleware();
    const ctx = createMockContext({
      customProperties: {
        body: {
          test: 'test',
        },
      },
    });
    const nextMock = jest.fn();

    await errorMiddleware(ctx, nextMock);

    expect(nextMock).toBeCalled();
    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual({
      test: 'test',
    });
  });
});
