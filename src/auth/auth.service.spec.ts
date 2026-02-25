import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { SUPABASE_CLIENT } from '../supabase/supabase.provider';
import * as bcrypt from 'bcrypt';

const mockSupabase = {
  from: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // --- REGISTER ---

  describe('register', () => {
    it('debería registrar un usuario correctamente y devolver un mensaje', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: { id: '123' }, error: null }),
      });

      const result = await service.register({
        name: 'Test User',
        email: 'test@test.com',
        password: '123456',
      });

      expect(result).toEqual({ message: 'User registered successfully' });
    });

    it('debería lanzar ConflictException si el email ya existe', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: { id: '123' }, error: null }),
      });

      await expect(
        service.register({
          name: 'Test User',
          email: 'test@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // --- LOGIN ---

  describe('login', () => {
    it('debería devolver un access_token con credenciales correctas', async () => {
      const hashedPassword = await bcrypt.hash('123456', 10);

      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: '123',
            email: 'test@test.com',
            encrypted_password: hashedPassword,
          },
          error: null,
        }),
      });

      mockJwtService.signAsync.mockResolvedValue('fake_token');

      const result = await service.login({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result).toEqual({ access_token: 'fake_token' });
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      });

      await expect(
        service.login({
          email: 'noexiste@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const hashedPassword = await bcrypt.hash('correcta', 10);

      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: '123',
            email: 'test@test.com',
            encrypted_password: hashedPassword,
          },
          error: null,
        }),
      });

      await expect(
        service.login({
          email: 'test@test.com',
          password: 'incorrecta',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
