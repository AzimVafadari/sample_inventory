import { Module } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { AuthController } from '../../controllers/auth/auth.controller';
import { jwtConstants } from '../../auth/constants';
import { JwtModule } from '@nestjs/jwt';
// import { UserService } from '../../services/user/user.service';
import { ArangoModule } from 'nest-arango';
import { UserEntity } from '../../entities/user/user.entity';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60000s' },
    }),
    ArangoModule.forFeature([UserEntity]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
