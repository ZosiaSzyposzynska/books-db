import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Param } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  async(@Param('id') id: string) {
    return this.userService.getById(id);
  }
}
