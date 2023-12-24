import { Module } from '@nestjs/common';
import { BuyOrderController } from '../../../controllers/order/buy-order/buy-order.controller';
import { BuyOrderService } from '../../../services/order/buy/buy-order.service';
import { BuyOrderEntity } from '../../../entities/order/buy/buy-order.entity';
import { ArangoModule } from 'nest-arango';
import { ReportEntity } from 'src/entities/report/report.entity';
import { ReportService } from 'src/services/report/report.service';

@Module({
  imports: [
    ArangoModule.forFeature([BuyOrderEntity]),
    ArangoModule.forFeature([ReportEntity]),
  ],
  exports: [BuyOrderService],
  controllers: [BuyOrderController],
  providers: [BuyOrderService, ReportService],
})
export class BuyOrderModule {}
