import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateBookDTO } from './create-book-dto';
import { UpdateBookDTO } from './update-book-dto';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.book.findMany({ include: { author: true } });
  }

  async getById(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async create(createBookDTO: CreateBookDTO) {
    try {
      return this.prismaService.book.create({ data: createBookDTO });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Title is already taken');
      } else if (error.code === 'P2025') {
        throw new BadRequestException('Not found');
      } else {
        throw error;
      }
    }
  }

  async update(id: string, updateBookDTO: UpdateBookDTO) {
    try {
      return this.prismaService.book.update({
        where: { id },
        data: updateBookDTO,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Title is already taken');
      } else if (error.code === 'P2025') {
        throw new BadRequestException('Not found');
      } else {
        throw error;
      }
    }
  }

  async deleteById(id: string) {
    return this.prismaService.book.delete({ where: { id } });
  }
}
