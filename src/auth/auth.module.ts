import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { env } from 'node:process';

@Module({
  imports :[UsersModule,
    JwtModule.register({
      global: true,
      secret:env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
  }),],
  providers: [AuthService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
