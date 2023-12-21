import { Module } from '@nestjs/common';
import { SaleOrderController } from '../../../controllers/order/sale-order/sale-order.controller';
import { SaleOrderService } from '../../../services/order/sale/sale-order.service';
import { SaleOrderEntity } from '../../../entities/order/sale/sale-order.entity';

@Module({
  imports: [SaleOrderEntity],
  controllers: [SaleOrderController],
  providers: [SaleOrderService],
})
export class SaleOrderModule {}
