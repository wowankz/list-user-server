import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Logger,
} from '@nestjs/common';
import { User } from 'dist/users/user.model';

import { UsersService } from './users.service';

@Controller('api')
export class UsersController {
  private logger: Logger;
  constructor(private readonly usersService: UsersService) {
    this.logger = new Logger('UsersController');
  }

  @Post('user/add')
  async addUser(@Body('user') data: User) {
    const user: User = data;
    this.logger.log('Add user  : ' + user.f_name + ' ' + user.s_name)
    const res = await this.usersService.insertUser(user);
    return res;
  }

  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.getUsers();
    return users;
  }

  @Get('user/:id')
  getUser(@Param('id') userId: string) {
    return this.usersService.getSingleUser(userId);
  }

  @Patch('user/update/:id')
  async updateUser(@Body('user') data: User, @Param('id') id: string) {
    const user: User = data;
    const res = await this.usersService.updateUser(user, id);
    return res;
  }

  @Delete('user/remove/:id')
  async removeUser(@Param('id') id: string) {
    const res = await this.usersService.deleteUser(id);
    return res;
  }
}
