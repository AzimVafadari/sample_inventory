import { Module } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { AuthController } from '../../controllers/auth/auth.controller';
import { UserModule } from '../user/user.module';
import { jwtConstants } from '../../auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../../services/user/user.service';
import { ArangoModule } from 'nest-arango';
import { UserEntity } from '../../entities/user/user.entity';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
    ArangoModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
