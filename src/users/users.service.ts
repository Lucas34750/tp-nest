import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { FollowDto } from './dto/follow.dto';

@Injectable()
export class UsersService {
  async unFollowUsers(followerId: number, body: FollowDto) {
    const usersToUnFollow = await this.prisma.user.findMany({
        where: { username: { in: body.usernames } },
    });
    
    if (usersToUnFollow.length === 0) {
      throw new NotFoundException('Aucun utilisateur trouvé');
    }
    
    let unFollows:any[] = [];
    
    for (const u of usersToUnFollow) {
      if (u.id === followerId) {
        throw new ConflictException("Impossible de ne plus se suivre soi-même");
      }
      const existing = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId: u.id,
          },
        },
      });
      if (!existing) {
        throw new ConflictException(`Userid : ${u.id} non suivi`);
      }

      if (existing) {
        const follow = await this.prisma.follow.delete({
          where:{id:existing.id}
        });
        unFollows.push(follow);
      }

    return unFollows;
    }
  }
    
    constructor(private readonly prisma:PrismaService){}

    async findById(userId: number) {
        return this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            email: true,
            dateCreate: true,
            followers: {
              select: {
                follower: { select: { id: true, username: true } },
              },
            },
            following: {
              select: {
                following: { select: { id: true, username: true } },
              },
            },
          },
        });
      }
      
    async create(data: CreateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (user) {
            throw new ForbiddenException('Email déjà utilisé');
        }
      
        const hashedPassword = await bcrypt.hash(data.password, 10);
      
        return this.prisma.user.create({
            data: {
              ...data,
              password: hashedPassword,
            },
          });
        }

    getFollowersById(id: number) {
        return this.prisma.follow.findMany({
            where: { followingId: id },
                select: {
                  follower: { select: { id: true, username: true } },
                },
          });
        }
    getFollowsById(id: number) {
        return this.prisma.follow.findMany({
            where: { followerId: id },
                select: 
                {
                  following: { select: { id: true, username: true } }
                },
          });
        }
    async followUsers(followerId: number, body: FollowDto) {
        const usersToFollow = await this.prisma.user.findMany({
            where: { username: { in: body.usernames } },
        });
        
        if (usersToFollow.length === 0) {
          throw new NotFoundException('Aucun utilisateur trouvé');
        }
        
        let follows:any[] = [];
        
        for (const u of usersToFollow) {
          if (u.id === followerId) {
            throw new ConflictException("Impossible de se suivre soi-même");
          }
          const existing = await this.prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId,
                followingId: u.id,
              },
            },
          });
          if (existing) {
            throw new ConflictException(`Userid : ${existing.followerId} déja suivi`);
          }
    
          if (!existing) {
            const follow = await this.prisma.follow.create({
              data: {
                followerId,
                followingId: u.id,
              },
            });
            follows.push(follow);
          }
        }
    
        return follows;
    }
}
