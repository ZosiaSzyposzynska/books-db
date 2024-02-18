import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateBookDTO } from './create-book-dto';
import { UpdateBookDTO } from './update-book-dto';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.book.findMany({  include: { author: true, users: true } });
  }

  async getById(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: { id },
      include: { author: true, users: true },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async create(createBookDTO: CreateBookDTO) {
    try {
      return this.prismaService.book.create({ data: createBookDTO });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Title is already taken');
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
      } else {
        throw error;
      }
    }
  }

  async deleteById(id: string) {
    return this.prismaService.book.delete({ where: { id } });
  }

async likeBook(bookId: string, userId: string) {
  try {
    // Sprawdź, czy książka istnieje
    const book = await this.getById(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Sprawdź, czy użytkownik istnieje
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Dodaj wpis do tabeli UserOnBooks
    await this.prismaService.userOnBooks.create({
      data: {
        book: {
          connect: { id: bookId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
}


}
