import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ConflictException } from '@nestjs/common';
import { Role, User, Password } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  public getById(id: User['id']): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  public async getByEmail(
    email: User['email'],
  ): Promise<(User & { password: Password }) | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
        password: true,
      },
    });
  }

  public async create(
    userData: Omit<User, 'id' | 'role'>,
    password: string,
  ): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data: {
          ...userData,
          password: {
            create: {
              hashedPassword: password,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('User is already taken');
      throw error;
    }
  }

  public async updateById(
    id: User['id'],
    userData: Omit<User, 'id'>,
    password?: string,
  ): Promise<User> {
    try {
      if (password !== undefined) {
        return await this.prismaService.user.update({
          where: { id },
          data: {
            ...userData,
            password: {
              update: {
                hashedPassword: password,
              },
            },
          },
        });
      } else {
        return await this.prismaService.user.update({
          where: { id },
          data: userData,
        });
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Name is already taken');
      }
      throw error;
    }
  }

  public deleteById(id: User['id']): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
