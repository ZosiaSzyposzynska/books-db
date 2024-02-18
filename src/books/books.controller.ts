import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './create-book-dto';
import { UpdateBookDTO } from './update-book-dto';
import { NotFoundException } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getAll() {
    return this.booksService.getAll();
  }

  @Get(':id')
  async(@Param('id') id: string) {
    return this.booksService.getById(id);
  }

@Post('/')
@UseGuards(JwtAuthGuard)
create(@Body() bookData: CreateBookDTO) {
  return this.booksService.create(bookData);
}

  @Put(':id')
  @UseGuards(JwtAuthGuard)
 update(@Param('id') id: string, @Body() updateBookDTO: UpdateBookDTO) {
    return this.booksService.update(id, updateBookDTO);
  }

  @Delete(':id')
   @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Book not found');
    await this.booksService.deleteById(id);
    return { success: true };
  }
}
