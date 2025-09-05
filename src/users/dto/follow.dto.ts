import { IsArray, IsNotEmpty } from "class-validator";

export class FollowDto {
  @IsArray()
  @IsNotEmpty()
  usernames:string[]
}
