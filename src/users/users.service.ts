import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { unlinkSync } from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';
import { multerConfig } from '../images/upload.config';
import { ImagesService } from './../images/images.service';

import { User } from './user.model';

@Injectable()
export class UsersService {
  private logger: Logger;

  constructor(@InjectModel('User') private readonly userModel: Model<User>, private ImagesService: ImagesService) {
    this.logger = new Logger('UsersService')
  }

  async insertUser(user: User) {
    try {
      const newUser = new this.userModel({ ...user });
      const result = await newUser.save();
      this.logger.log('User :' + user.f_name + ' ' + user.s_name + ' was added');
      return { statusCode: 201, message: `User ${user.f_name} ${user.s_name} was created`, data: { id: result.id } };
    } catch (error) {
      if (error.code == 11000) {
        this.logger.error(error.errmsg);
        throw new HttpException({ statusCode: 409, "message": `The email ${error.keyValue.email} is existed` }, 409);
      } else {
        this.logger.error(error.message);
        throw new HttpException('Could not create a new user.', 500);
      }
    }

  }

  async getUsers() {
    const users = await this.userModel.find().exec();
    return users.map(prod => ({
      id: prod.id,
      f_name: prod.f_name,
      s_name: prod.s_name,
      email: prod.email,
      phone: prod.phone,
      avatar: prod.avatar
    }));
  }

  async getSingleUser(userId: string) {
    const user = await this.findUser(userId);
    return {
      id: user.id,
      f_name: user.f_name,
      s_name: user.s_name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar
    };
  }

  async updateUser(user: User, id) {
    try {
      const updatedUser = await this.findUser(id);

      if (user.f_name) updatedUser.f_name = user.f_name;
      if (user.s_name) updatedUser.s_name = user.s_name;
      if (user.email) updatedUser.email = user.email;
      if (user.phone) updatedUser.phone = user.phone;
      if (user.avatar) updatedUser.avatar = user.avatar;
      const result = await updatedUser.save();

      this.logger.log('Updated user with id: ' + result.id)
      return { statusCode: 201, message: `User  was updated`, data: { id: result.id } };

    } catch (error) {
      if (error.code == 11000) {
        this.logger.error(error.errmsg);
        throw new HttpException({ statusCode: 409, "message": `The email ${error.keyValue.email} is existed` }, 409);
      } else {
        this.logger.error(error.message);
        throw new HttpException('Could not update user.', 500);
      }
    }

  }

  async deleteUser(userId: string) {
    this.logger.log('Delete user with id : ' + userId)
    try {
      const user = await this.findUser(userId);
      try {
        if (user.avatar) this.ImagesService.removeImg(join(multerConfig.dest, user.avatar));
      } catch (error) {
        this.logger.error(error.message)
      }


      const result = await this.userModel.deleteOne({ _id: userId }).exec();
      if (result.n === 0) {
        this.logger.log('Could not find user.');
        throw new NotFoundException('Could not find user.');
      }
      this.logger.log(`User with id ${userId} was deleted`);
      return {
        "statusCode": 200,
        "message": `User with id ${userId} was deleted`,
        "data": { id: userId }

      }
    } catch (error) {
      this.logger.error(`Incorrect id : ( ${userId} ) for user`)
      throw new NotFoundException(`Incorrect id : ( ${userId} ) for user`);
    }
  }

  private async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
    if (!user) {
      throw new NotFoundException('Could not find product.');
    }
    return user;
  }
}
