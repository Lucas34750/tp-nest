import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/jwt.guard';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PostModule,
  ],
  controllers: [AppController, PostController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule {}
