import { Module } from '@nestjs/common';
import { BuyOrderController } from '../../../controllers/order/buy-order/buy-order.controller';
import { BuyOrderService } from '../../../services/order/buy/buy-order.service';
import { BuyOrderEntity } from '../../../entities/order/buy/buy-order.entity';

@Module({
  imports: [BuyOrderEntity],
  controllers: [BuyOrderController],
  providers: [BuyOrderService],
})
export class BuyOrderModule {}
