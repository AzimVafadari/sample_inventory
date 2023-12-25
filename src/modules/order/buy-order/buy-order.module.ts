import { Module } from '@nestjs/common';
import { BuyOrderController } from '../../../controllers/order/buy-order/buy-order.controller';
import { BuyOrderService } from '../../../services/order/buy/buy-order.service';
import { BuyOrderEntity } from '../../../entities/order/buy/buy-order.entity';
import { ArangoModule } from 'nest-arango';
import { ReportService } from '../../../services/report/report.service';
import { ReportEntity } from '../../../entities/report/report.entity';

@Module({
  imports: [ArangoModule.forFeature([BuyOrderEntity, ReportEntity])],
  controllers: [BuyOrderController],
  providers: [BuyOrderService, ReportService],
})
export class BuyOrderModule {}
