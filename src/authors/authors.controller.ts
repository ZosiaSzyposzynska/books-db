import { Controller, Get } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { NotFoundException } from '@nestjs/common';
import { Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateAuthorDTO } from './create-author.dto';
import { UpdateAuthorDTO } from './update-author.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Get('/')
  getAll() {
    return this.authorsService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const author = await this.authorsService.getById(id);
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }


  @Post('/')
@UseGuards(JwtAuthGuard)
create(@Body() authorData: CreateAuthorDTO) {
  return this.authorsService.create(authorData);
}


  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() authorData: UpdateAuthorDTO,
  ) {
    if (!(await this.authorsService.getById(id)))
      throw new NotFoundException('Author not found');

    await this.authorsService.updateById(id, authorData);
    return { success: true };
  }

  @Delete('/:id')
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.authorsService.getById(id)))
      throw new NotFoundException('Author not found');
    await this.authorsService.deleteById(id);
    return { success: true };
  }
}
