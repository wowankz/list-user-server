import { ImagesService } from './images/images.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ImagesController } from './images/images.controller';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      'mongodb://localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    ),
  ],
  controllers: [AppController, ImagesController],
  providers: [
    ImagesService, AppService],
})
export class AppModule { }
