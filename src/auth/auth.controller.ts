import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './public.decorateur';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService:AuthService
    ){}

    @Post('signin')
    @Public()
    signin(@Body() data:CreateUserDto){
        return this.authService.signin(data);
    }

    @Post('login')
    @Public()
    login(@Body() data: LoginDto){
        return this.authService.login(data);
    }

}
