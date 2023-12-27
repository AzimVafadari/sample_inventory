import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ArangoRepository } from 'nest-arango';
import { UserEntity } from 'src/entities/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    // private usersService: UserService,
    private readonly userRepository: ArangoRepository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
