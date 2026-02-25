import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

const mockReflector = {
  getAllAndOverride: jest.fn(),
};

const createMockContext = (role: string): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: { userId: '123', email: 'test@test.com', role },
      }),
    }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard(mockReflector as unknown as Reflector);
    jest.clearAllMocks();
  });

  it('debería permitir el acceso si no hay roles requeridos', () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);

    const result = guard.canActivate(createMockContext('user'));

    expect(result).toBe(true);
  });

  it('debería permitir el acceso si el usuario tiene el rol requerido', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);

    const result = guard.canActivate(createMockContext('admin'));

    expect(result).toBe(true);
  });

  it('debería lanzar ForbiddenException si el usuario no tiene el rol requerido', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);

    expect(() => guard.canActivate(createMockContext('user'))).toThrow(
      ForbiddenException,
    );
  });
});
