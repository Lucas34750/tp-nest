import { IsString, IsNotEmpty} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  image: string;
  usernames: any;
}
