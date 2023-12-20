import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BuyOrderService } from '../../../services/order/buy/buy-order.service';
import { BuyOrderEntity } from '../../../entities/order/buy/buy-order.entity';

@Controller('buy-order')
export class BuyOrderController {
  constructor(private readonly buyOrderService: BuyOrderService) {}
  //This method creates buyOrder if it doesn't exist and returns an object that says the status of creation
  @Post()
  @ApiOperation({
    summary: 'ایجاد تامین کننده',
  })
  async createBuyOrder(@Body() buyOrder: BuyOrderEntity) {
    return await this.buyOrderService.create(buyOrder);
  }
  //This method is created to receive all buyOrders
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی تامین کنندگان',
  })
  async getAllBuyOrders() {
    return await this.buyOrderService.findAll();
  }
  //This method update the buyOrder by its updated form and returns an object that says the update status
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک تامین کننده به وسیله نام آن',
  })
  async updatebuyOrder(@Body() updatedbuyOrder: BuyOrderEntity) {
    return await this.buyOrderService.update(updatedbuyOrder);
  }
  //This method remove the buyOrder if it does exist and returns an object
  @Delete(':buyOrder_id')
  @ApiOperation({
    summary: 'حذف تامین کننده به وسیله آیدی آن',
  })
  async deleteBuyOrder(@Param('buyOrder_id') buyOrder_id: string) {
    return await this.buyOrderService.remove(buyOrder_id);
  }
  @Get(':status')
  @ApiOperation({
    summary: 'دریافت یک تامین کننده به وسیله نام آن',
  })
  async findBuyOrderByStatus(@Param('status') status: string) {
    return await this.buyOrderService.findManyByStatus(status);
  }
  @Get(':productId')
  @ApiOperation({
    summary: 'دریافت یک تامین کننده به وسیله نام آن',
  })
  async findBuyOrderByProductId(@Param('productId') productId: string) {
    return await this.buyOrderService.findManyByProductId(productId);
  }
  @Get(':supplierId')
  @ApiOperation({
    summary: 'دریافت یک تامین کننده به وسیله نام آن',
  })
  async findBuyOrderBySupplierId(@Param('supplierId') supplierId: string) {
    return await this.buyOrderService.findManyBySupplierId(supplierId);
  }
}
