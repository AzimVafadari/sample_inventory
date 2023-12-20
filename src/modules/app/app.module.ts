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
import { CustomerEntity } from 'src/entities/customer/customer.entity';
import { SupplierController } from 'src/controllers/supplier/supplier.controller';
import { SupplierService } from 'src/services/supplier/supplier.service';
import { SupplierEntity } from 'src/entities/supplier/supplier.entity';
import { ReportController } from 'src/controllers/report/report.controller';
import { ReportService } from 'src/services/report/report.service';
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
      CustomerEntity,
      SupplierEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [
    UserController,
    ProductController,
    CategoryController,
    SupplierController,
    ReportController,
  ],
  providers: [
    UserService,
    ProductService,
    CategoryService,
    AuthService,
    SupplierService,
    ReportService,
  ],
})
export class AppModule {}
