import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuyOrderService } from '../../../services/order/buy/buy-order.service';
import { BuyOrderEntity } from '../../../entities/order/buy/buy-order.entity';
import { AuthGuard } from '../../../auth/auth.guard';
import { BuyOrderFilter } from '../../../interfaces/order/buy/buy-order-filter';
@ApiTags('buy-order')
@ApiBearerAuth()
@Controller('buy-order')
export class BuyOrderController {
  constructor(private readonly buyOrderService: BuyOrderService) {}
  //This method creates buyOrder if it doesn't exist and returns an object that says the status of creation
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'ایجاد سفارش خرید',
  })
  async createBuyOrder(@Body() buyOrder: BuyOrderEntity) {
    return await this.buyOrderService.create(buyOrder);
  }
  //This method is created to receive all buyOrders
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی سفارش های خرید',
  })
  async getAllBuyOrders() {
    return await this.buyOrderService.findAll();
  }
  //This method is created to receive all buyOrders
  @UseGuards(AuthGuard)
  @Get(':Key')
  @ApiOperation({
    summary: 'دریافت سفارش خرید به وسیله آیدی آن',
  })
  async getBuyOrdersById(@Param('Key') Key: string) {
    return await this.buyOrderService.findByKey(Key);
  }
  //This method update the buyOrder by its updated form and returns an object that says the update status
  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک سفارش خرید',
  })
  async updateBuyOrder(
    @Body() updatedBuyOrder: BuyOrderEntity,
    @Query('_id') _id: string,
  ) {
    return await this.buyOrderService.update(_id, updatedBuyOrder);
  }
  //This method remove the buyOrder if it does exist and returns an object
  @UseGuards(AuthGuard)
  @Delete(':buyOrder_id')
  @ApiOperation({
    summary: 'حذف سفارش خرید',
  })
  async deleteBuyOrder(@Param('buyOrder_id') buyOrder_id: string) {
    return await this.buyOrderService.remove(buyOrder_id);
  }
  @UseGuards(AuthGuard)
  @Get('findBasedOnSomeFilters')
  @ApiOperation({
    summary: 'دریافت یک سفارش خرید به وسیله چندین فیلتر',
  })
  async findSaleOrderBySomeFilters(@Body() filter: BuyOrderFilter) {
    return await this.buyOrderService.multiFilter(filter);
  }
}
