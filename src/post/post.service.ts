import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
    async like(userId: number, postId: number) {
      const post = await this.prisma.post.findUnique({
        where:{id:postId}
      });

      if(!post)throw new NotFoundException("post innexistant");

      const like= await this.prisma.like.findMany({
        where:{userId,postId}
      });

      if(like.length!=0) throw new ForbiddenException("vous avez déja liké ce post");
        
      return this.prisma.like.create({
        data:{
          postId,
          userId,

        }
      })
    }
    async unlike(userId: number, postId: number) {
      const post = await this.prisma.post.findUnique({
        where:{id:postId}
      });

      if(!post)throw new NotFoundException("post innexistant");

      const like= await this.prisma.like.findUnique({
        where: { userId_postId: { userId, postId } }
      });

      if(!like) throw new ForbiddenException("vous n'avez pas liké ce post");
        
      return this.prisma.like.delete({
        where: { userId_postId: { userId, postId } }
      })
    }
    private readonly selectPost = {
        id: true,
        text: true,
        image: true,
        createdAt: true,
        user: {
          select: { username: true },
        },
        _count: {
          select: { likes: true }, 
        },
    };
      
    async delete(userId: number, postId: number) {
        const post =await this.prisma.post.findUnique({
            where:{id:postId}
        });

        if(!post) throw new NotFoundException("ce post n'existe pas");
        if(post.userId!=userId) throw new ForbiddenException("ce post ne vous appartient pas");

        return this.prisma.post.delete({
            where :{id:postId}
        });
    }
    async findAllByFollowing(userId: number) {

        const followed=await this.prisma.follow.findMany({
            where: { followerId: userId },
                select: 
                {
                  following: { select: { id: true} }
                },
          });
        const followedIds=followed.map((f)=>f.following.id);

        return this.prisma.post.findMany({
            where:{
                userId:{in:followedIds}
            },
            select:this.selectPost
        });
    }
    findAll() {
        return this.prisma.post.findMany({
            select:this.selectPost
        })
    }

    constructor(private readonly prisma:PrismaService){}

    async create(userId: number, body: CreatePostDto) {
        return this.prisma.post.create({
          data: {
            ...body,
            user: {
              connect: { id: userId },
            },
          },
        });
      }
      
}
