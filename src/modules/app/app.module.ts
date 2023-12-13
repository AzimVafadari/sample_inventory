import { Module } from '@nestjs/common';
import { UserController } from '../../controllers/user/user.controller';
import { ArangoModule } from 'nest-arango';
import { UserEntity } from '../../entities/user/user.entity';
import { UserService } from '../../services/user/user.service';
import { ProductController } from '../../controllers/product/product.controller';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product/product.entity';
import { CategoryService } from '../../services/category/category.service';
import { CategoryController } from '../../controllers/category/category.controller';
import { CategoryEntity } from '../../entities/category/category.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';
import { AuthService } from '../../auth/auth.service';
import { ReportEntity } from 'src/entities/report/report.entity';
import { InventoryEntity } from 'src/entities/inventory/inventory.entity';
import { CustomerEntity } from 'src/entities/customer/customer.entity';
@Module({
  imports: [
    ArangoModule.forRoot({
      config: {
        url: 'http://localhost:8529',
        databaseName: '_system',
        auth: { username: 'root', password: 'azim1383' },
      },
    }),
    ArangoModule.forFeature([
      UserEntity,
      ProductEntity,
      CategoryEntity,
      ReportEntity,
      InventoryEntity,
      CustomerEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [UserController, ProductController, CategoryController],
  providers: [UserService, ProductService, CategoryService, AuthService],
})
export class AppModule {}
