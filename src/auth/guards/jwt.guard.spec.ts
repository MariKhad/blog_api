import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from './jwt.guard';

describe('JwtGuard', () => {
  let guard: JwtGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    guard = new JwtGuard(reflector);
  });

  it('should throw UnauthorizedException if no token is provided', () => {
    const mockExecutionContext = {
      getHandler: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext)).toThrowError(
      UnauthorizedException,
    );
  });
});
