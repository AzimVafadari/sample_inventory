import { Module } from '@nestjs/common';
// import { SupplierController } from 'src/controllers/supplier/supplier.controller';
// import { ReportController } from 'src/controllers/report/report.controller';
// import { UserController } from '../../controllers/user/user.controller';
// import { SaleOrderController } from '../../controllers/order/sale-order/sale-order.controller';
// import { CustomerController } from '../../controllers/customer/customer.controller';
// import { ProductController } from '../../controllers/product/product.controller';
// import { BuyOrderController } from '../../controllers/order/buy-order/buy-order.controller';
// import { CategoryController } from '../../controllers/category/category.controller';
import { ArangoModule } from 'nest-arango';
import { UserEntity } from '../../entities/user/user.entity';
import { ProductEntity } from '../../entities/product/product.entity';
import { CategoryEntity } from '../../entities/category/category.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';
import { ReportEntity } from 'src/entities/report/report.entity';
import { CustomerEntity } from 'src/entities/customer/customer.entity';
import { SupplierEntity } from 'src/entities/supplier/supplier.entity';
import { BuyOrderEntity } from '../../entities/order/buy/buy-order.entity';
import { SaleOrderEntity } from '../../entities/order/sale/sale-order.entity';
// import { ProductService } from '../../services/product/product.service';
// import { UserService } from '../../services/user/user.service';
// import { CategoryService } from '../../services/category/category.service';
// import { AuthService } from '../../auth/auth.service';
// import { SupplierService } from 'src/services/supplier/supplier.service';
// import { BuyOrderService } from '../../services/order/buy/buy-order.service';
// import { ReportService } from 'src/services/report/report.service';
// import { SaleOrderService } from '../../services/order/sale/sale-order.service';
// import { CustomerService } from '../../services/customer/customer.service';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';
import { SupplierModule } from '../supplier/supplier.module';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { BuyOrderModule } from '../order/buy-order/buy-order.module';
import { SaleOrderModule } from '../order/sale-order/sale-order.module';
import { ReportModule } from '../report/report.module';
@Module({
  imports: [
    UserModule,
    ReportModule,
    SaleOrderModule,
    BuyOrderModule,
    CategoryModule,
    ProductModule,
    SupplierModule,
    CustomerModule,
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
      BuyOrderEntity,
      SaleOrderEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  // controllers: [
  //   UserController,
  //   ProductController,
  //   CategoryController,
  //   SupplierController,
  //   BuyOrderController,
  //   SaleOrderController,
  //   ReportController,
  //   CustomerController,
  // ],
  // providers: [
  //   UserService,
  //   ProductService,
  //   CategoryService,
  //   AuthService,
  //   SupplierService,
  //   BuyOrderService,
  //   SaleOrderService,
  //   ReportService,
  //   CustomerService,
  // ],
})
export class AppModule {}
