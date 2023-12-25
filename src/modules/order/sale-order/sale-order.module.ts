import { Module } from '@nestjs/common';
import { SaleOrderController } from '../../../controllers/order/sale-order/sale-order.controller';
import { SaleOrderService } from '../../../services/order/sale/sale-order.service';
import { SaleOrderEntity } from '../../../entities/order/sale/sale-order.entity';
import { ArangoModule } from 'nest-arango';
import { ReportService } from '../../../services/report/report.service';
import { ReportEntity } from '../../../entities/report/report.entity';

@Module({
  imports: [ArangoModule.forFeature([SaleOrderEntity, ReportEntity])],
  controllers: [SaleOrderController],
  providers: [SaleOrderService, ReportService],
})
export class SaleOrderModule {}
