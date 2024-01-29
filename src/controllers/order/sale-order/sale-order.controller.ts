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
import { SaleOrderEntity } from '../../../entities/order/sale/sale-order.entity';
import { SaleOrderService } from '../../../services/order/sale/sale-order.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { SaleOrderFilter } from '../../../interfaces/order/sale/sale-order-filter';
import { validate } from 'class-validator';
import { MyDatabase } from '../../../database/database';

@ApiTags('sale-order')
@ApiBearerAuth()
@Controller('sale-order')
export class SaleOrderController {
  constructor(private readonly saleOrderService: SaleOrderService) {}

  //This method creates saleOrder if it doesn't exist and returns an object that says the status of creation
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'ایجاد سفارش فروش',
  })
  async createSaleOrder(@Body() saleOrder: SaleOrderEntity) {
    return await this.saleOrderService.create(saleOrder);
  }

  //This method is created to receive all saleOrders
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی سفارش های فروش',
  })
  async getAllSaleOrders() {
    return await this.saleOrderService.findAll();
  }

  //This method update the saleOrder by its updated form and returns an object that says the update status
  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک سفارش فروش',
  })
  async updateSaleOrder(
    @Body() updatedSaleOrder: SaleOrderEntity,
    @Query('_id') _id: string,
  ) {
    return await this.saleOrderService.update(_id, updatedSaleOrder);
  }

  //This method remove the saleOrder if it does exist and returns an object
  @UseGuards(AuthGuard)
  @Delete(':saleOrder_id')
  @ApiOperation({
    summary: 'حذف سفارش فروش',
  })
  async deleteSaleOrder(@Query('saleOrder_id') saleOrder_id: string) {
    return await this.saleOrderService.remove(saleOrder_id);
  }

  @UseGuards(AuthGuard)
  @Get('findByFilters')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله چندین فیلتر',
  })
  async findSaleOrderBySomeFilters(@Query('filter') filter: string) {
    const filterObject: SaleOrderFilter = JSON.parse(filter);
    const saleOrderFilter = new SaleOrderFilter(filterObject);
    const errors = await validate(saleOrderFilter);
    if (errors.length > 0) {
      return { errors: errors };
    } else {
      return await this.saleOrderService.multiFilter(saleOrderFilter);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':key')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله شناسه',
  })
  async findSaleOrderByKey(@Param('key') key: string) {
    return await MyDatabase.findByKey(key, 'SaleOrders');
  }
}
