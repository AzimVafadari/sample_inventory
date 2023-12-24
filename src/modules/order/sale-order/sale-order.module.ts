import { Module } from '@nestjs/common';
import { SaleOrderController } from '../../../controllers/order/sale-order/sale-order.controller';
import { SaleOrderService } from '../../../services/order/sale/sale-order.service';
import { SaleOrderEntity } from '../../../entities/order/sale/sale-order.entity';
import { ArangoModule } from 'nest-arango';
import { ReportEntity } from 'src/entities/report/report.entity';
import { ReportService } from 'src/services/report/report.service';

@Module({
  imports: [
    ArangoModule.forFeature([SaleOrderEntity]),
    ArangoModule.forFeature([ReportEntity]),
  ],
  controllers: [SaleOrderController],
  providers: [SaleOrderService, ReportService],
  exports: [SaleOrderService],
})
export class SaleOrderModule {}
