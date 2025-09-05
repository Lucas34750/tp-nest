import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorateur';

@Controller()
export class AppController {

  @Get()
  @Public()
  getHello(): string {
    return "Bienvenue sur Mon Social Network API </br>Pour plus d'info sur l'api rdv sur <a href='/api'>le swagger<a/>";
  }
}
