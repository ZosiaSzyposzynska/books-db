import { Controller, Get, Param, Post, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './create-book-dto';
import { UpdateBookDTO } from './update-book-dto';
import { NotFoundException } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getAll() {
    return this.booksService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.booksService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() bookData: CreateBookDTO) {
    return this.booksService.create(bookData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateBookDTO: UpdateBookDTO) {
    return this.booksService.update(id, updateBookDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    await this.booksService.deleteById(id);
    return { success: true };
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async likeBook(
    @Param('id') id: string,
    @Body('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.booksService.likeBook(id, userId);
  }
}
