import { Module } from '@nestjs/common';
import { ArangoModule } from 'nest-arango';
import { UserEntity } from '../../entities/user/user.entity';
import { ProductEntity } from '../../entities/product/product.entity';
import { CategoryEntity } from '../../entities/category/category.entity';
import { ReportEntity } from 'src/entities/report/report.entity';
import { CustomerEntity } from 'src/entities/customer/customer.entity';
import { SupplierEntity } from 'src/entities/supplier/supplier.entity';
import { BuyOrderEntity } from '../../entities/order/buy/buy-order.entity';
import { SaleOrderEntity } from '../../entities/order/sale/sale-order.entity';
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
    CustomerModule,
    SupplierModule,
    ProductModule,
    CategoryModule,
    BuyOrderModule,
    SaleOrderModule,
    ReportModule,
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
  ],
})
export class AppModule {}
