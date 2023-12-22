import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';
import { UserController } from '../../controllers/user/user.controller';
import { UserService } from '../../services/user/user.service';
import { UserEntity } from '../../entities/user/user.entity';
import { ArangoModule } from 'nest-arango';

@Module({
  imports: [
    ArangoModule.forFeature([
      UserEntity,
      // ProductEntity,
      // CategoryEntity,
      // ReportEntity,
      // CustomerEntity,
      // SupplierEntity,
      // BuyOrderEntity,
      // SaleOrderEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
