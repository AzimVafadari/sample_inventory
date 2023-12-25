import { Module } from '@nestjs/common';
import { ArangoModule } from 'nest-arango';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { BuyOrderModule } from '../order/buy-order/buy-order.module';
import { SaleOrderModule } from '../order/sale-order/sale-order.module';
import { ReportModule } from '../report/report.module';
import { SupplierModule } from '../supplier/supplier.module';
import { CustomerModule } from '../customer/customer.module';
@Module({
  imports: [
    ArangoModule.forRoot({
      config: {
        url: 'http://localhost:8529',
        databaseName: '_system',
        auth: { username: 'root', password: 'azim1383' },
      },
    }),
    UserModule,
    CategoryModule,
    ProductModule,
    BuyOrderModule,
    SaleOrderModule,
    ReportModule,
    SupplierModule,
    CustomerModule,
  ],
})
export class AppModule {}
