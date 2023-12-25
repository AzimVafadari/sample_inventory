import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuyOrderService } from '../../../services/order/buy/buy-order.service';
import { BuyOrderEntity } from '../../../entities/order/buy/buy-order.entity';
@ApiTags('buy-order')
@Controller('buy-order')
export class BuyOrderController {
  constructor(private readonly buyOrderService: BuyOrderService) {}
  //This method creates buyOrder if it doesn't exist and returns an object that says the status of creation
  @Post()
  @ApiOperation({
    summary: 'ایجاد سفارش خرید',
  })
  async createBuyOrder(@Body() buyOrder: BuyOrderEntity) {
    return await this.buyOrderService.create(buyOrder);
  }
  //This method is created to receive all buyOrders
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی سفارش های خرید',
  })
  async getAllBuyOrders() {
    return await this.buyOrderService.findAll();
  }
  //This method update the buyOrder by its updated form and returns an object that says the update status
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک سفارش خرید',
  })
  async updateBuyOrder(@Body() updatedBuyOrder: BuyOrderEntity) {
    return await this.buyOrderService.update(updatedBuyOrder);
  }
  //This method remove the buyOrder if it does exist and returns an object
  @Delete(':buyOrder_id')
  @ApiOperation({
    summary: 'حذف سفارش خرید',
  })
  async deleteBuyOrder(@Param('buyOrder_id') buyOrder_id: string) {
    return await this.buyOrderService.remove(buyOrder_id);
  }
  @Get(':status')
  @ApiOperation({
    summary: 'دریافت یک سفارش خرید به وسیله وضعیت آن',
  })
  async findBuyOrderByStatus(@Param('status') status: string) {
    return await this.buyOrderService.findManyByStatus(status);
  }
  @Get(':productId')
  @ApiOperation({
    summary: 'دریافت یک سفارش خرید به وسیله آیدی محصول آن',
  })
  async findBuyOrderByProductId(@Param('productId') productId: string) {
    return await this.buyOrderService.findManyByProductId(productId);
  }
  @Get(':supplierId')
  @ApiOperation({
    summary: 'دریافت یک سفارش خرید کننده به وسیله آیدی تامین کننده آن',
  })
  async findBuyOrderBySupplierId(@Param('supplierId') supplierId: string) {
    return await this.buyOrderService.findManyBySupplierId(supplierId);
  }
}
