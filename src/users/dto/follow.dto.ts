import { IsArray, IsNotEmpty, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowDto {
  @ApiProperty({
    description: 'Liste des usernames à suivre ou à ne plus suivre',
    type: [String],
    example: ['paul', 'marie']
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) 
  usernames: string[];
}
