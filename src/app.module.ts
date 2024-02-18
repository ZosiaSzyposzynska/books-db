import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import * as cors from 'cors';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorsModule } from './authors/authors.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthorsModule, PrismaModule, BooksModule, AuthModule,
  ConfigModule.forRoot({
  load: [configuration],
  isGlobal: true
})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cors()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
  
}
