import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
    constructor(private readonly postService:PostService){}

    @Post()
    newPost(@Req()req , @Body() body:CreatePostDto){
        return this.postService.create(req.user.sub,body);
    }

    @Get()
    findAll(){
        return this.postService.findAll();
    }

    @Get("feed")
    findAllByFollowing(@Req() req){
        return this.postService.findAllByFollowing(req.user.sub);
    }

    @Delete(":id")
    deletePost(@Req() req,@Param("id",ParseIntPipe) id:number){
        return this.postService.delete(req.user.sub,id);
    }

    @Post("like")
    like(@Req() req,@Body("id",ParseIntPipe) id:number){
        return this.postService.like(req.user.sub,id);
    }

    @Post("unlike")
    unlike(@Req() req,@Body("id",ParseIntPipe) id:number){
        return this.postService.unlike(req.user.sub,id);
    }

}
