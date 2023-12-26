import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';
import { UserController } from '../../controllers/user/user.controller';
import { UserService } from '../../services/user/user.service';
import { UserEntity } from '../../entities/user/user.entity';
import { ArangoModule } from 'nest-arango';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),
    ArangoModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
