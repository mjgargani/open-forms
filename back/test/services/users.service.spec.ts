import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    mockPrismaService.user.findMany.mockResolvedValue([]);
    const users = await service.findAll();
    expect(users).toEqual([]);
    expect(mockPrismaService.user.findMany).toHaveBeenCalled();
  });

  it('should find one user by username', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', user: 'test' });
    const user = await service.findOne('test');
    expect(user).toEqual({ id: '1', user: 'test' });
  });

  it('should remove a user', async () => {
    mockPrismaService.user.delete.mockResolvedValue({ id: '1' });
    const user = await service.remove('1');
    expect(user).toEqual({ id: '1' });
  });

  it('should update a user', async () => {
    mockPrismaService.user.update.mockResolvedValue({ id: '1', name: 'new name' });
    const user = await service.update('1', { name: 'new name' });
    expect(user).toEqual({ id: '1', name: 'new name' });
  });

  it('should create a user', async () => {
     mockPrismaService.user.create.mockResolvedValue({ id: '1', user: 'new_user' });
     const user = await service.create({ user: 'new_user', password: 'password', name: 'New User' });
     expect(user).toEqual({ id: '1', user: 'new_user' });
  });

  it('should throw error when creating without password', async () => {
      await expect(service.create({ user: 'test', name: 'test' })).rejects.toThrow('Password is required');
  });
});
