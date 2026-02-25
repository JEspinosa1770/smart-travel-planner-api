import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { SUPABASE_CLIENT } from '../supabase/supabase.provider';

const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@test.com',
  role: 'user',
  created_at: '2026-01-01T00:00:00Z',
};

const mockSupabase = {
  from: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería devolver una lista de usuarios', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('test@test.com');
    });

    it('debería lanzar NotFoundException si Supabase devuelve error', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Error de base de datos' },
        }),
      });

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('debería devolver el perfil de un usuario por id', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
      });

      const result = await service.findOne('user-123');

      expect(result.id).toBe('user-123');
      expect(result.email).toBe('test@test.com');
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'No encontrado' },
        }),
      });

      await expect(service.findOne('inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('debería actualizar el perfil de un usuario', async () => {
      const updatedUser = { ...mockUser, name: 'Nuevo Nombre' };

      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: updatedUser, error: null }),
      });

      const result = await service.update('user-123', { name: 'Nuevo Nombre' });

      expect(result.name).toBe('Nuevo Nombre');
    });
  });

  describe('remove', () => {
    it('debería eliminar un usuario correctamente', async () => {
      mockSupabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      const result = await service.remove('user-123');

      expect(result).toEqual({ message: 'Usuario borrado correctamente' });
    });

    it('debería lanzar NotFoundException si Supabase devuelve error al eliminar', async () => {
      mockSupabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: { message: 'Error al eliminar' },
        }),
      });

      await expect(service.remove('inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
