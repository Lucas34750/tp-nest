import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'Contenu textuel du post', example: 'Mon premier post' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'URL de l’image (facultatif)', example: 'http://image.url', required: false })
  @IsString()
  @IsOptional()
  image?: string;
}
