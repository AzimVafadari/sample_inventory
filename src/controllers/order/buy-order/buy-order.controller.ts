import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { validate } from 'class-validator';
import { MyDatabase } from '../../../database/database';
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
    try {
      return await this.buyOrderService.create(buyOrder);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //This method is created to receive all buyOrders
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی سفارش های خرید',
  })
  async getAllBuyOrders() {
    try {
      return await this.buyOrderService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //This method is created to receive all buyOrders
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
    try {
      return await this.buyOrderService.update(_id, updatedBuyOrder);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //This method remove the buyOrder if it does exist and returns an object
  @UseGuards(AuthGuard)
  @Delete(':buyOrder_id')
  @ApiOperation({
    summary: 'حذف سفارش خرید',
  })
  async deleteBuyOrder(@Param('buyOrder_id') buyOrder_id: string) {
    try {
      return await this.buyOrderService.remove(buyOrder_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(AuthGuard)
  @Get('findByFilters')
  @ApiOperation({
    summary: 'دریافت یک سفارش خرید به وسیله چندین فیلتر',
  })
  async findBuyOrderBySomeFilters(@Query('filter') filter: string) {
    const filterObject: BuyOrderFilter = JSON.parse(filter);
    const buyOrderFilter = new BuyOrderFilter(filterObject);
    const errors = await validate(buyOrderFilter);
    if (errors.length > 0) {
      throw new HttpException(errors[0].constraints, HttpStatus.BAD_REQUEST);
    } else {
      return await this.buyOrderService.multiFilter(buyOrderFilter);
    }
  }
  @UseGuards(AuthGuard)
  @Get(':key')
  @ApiOperation({
    summary: 'دریافت سفارش خرید به وسیله آیدی آن',
  })
  async getBuyOrdersByKey(@Param('key') key: string) {
    try {
      return await MyDatabase.findByKey(
        key,
        'BuyOrders',
        "buyOrder doesn't exist",
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
