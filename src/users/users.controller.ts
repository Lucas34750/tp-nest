import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { FollowDto } from "./dto/follow.dto";

@Controller("users")
export class UsersController{

    constructor(private readonly usersService:UsersService){}

    @Get("profile")
    getMyProfile(@Req() req){
        let userId = req.user.sub;
        return this.usersService.findById(userId);
    }

    @Get("profile/:id")
    getProfile(@Param("id",ParseIntPipe) id:number){
        return this.usersService.findById(id);
    }

    @Get("follows")
    getMyFollows(@Req() req){
        return this.usersService.getFollowsById(req.user.sub);
    }

    @Get("followers")
    getMyFollowers(@Req() req){
        return this.usersService.getFollowersById(req.user.sub);
    }

    @Post("follow")
    followUsers(@Req() req, @Body() body:FollowDto) {
        const followerId = req.user.sub;
        return this.usersService.followUsers(followerId, body);
      }
    @Post("unfollow")
    unFollowUsers(@Req() req, @Body() body:FollowDto) {
        const followerId = req.user.sub;
        return this.usersService.unFollowUsers(followerId, body);
    }
}