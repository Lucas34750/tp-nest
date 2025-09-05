import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly prisma:PrismaService,
        private readonly userService:UsersService,
    ) {}
    async login(data : LoginDto) {
        const user = await this.prisma.user.findUnique({
            where:{
                email:data.email,
            }
        });
        if (!user) throw new NotFoundException('Email incorrect');

        const isValid = await bcrypt.compare(data.password, user.password); 
        if (!isValid) throw new UnauthorizedException('Mot de passe incorrect');
    
        const payload = { sub: user.id, email: user.email};
        return { access_token: await this.jwt.signAsync(payload) };
      }


    async signin(data : CreateUserDto){
        return this.userService.create(data);
    }
}

