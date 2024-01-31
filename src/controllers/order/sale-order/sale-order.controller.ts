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
    try {
      return await this.saleOrderService.create(saleOrder);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //This method is created to receive all saleOrders
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی سفارش های فروش',
  })
  async getAllSaleOrders() {
    try {
      return await this.saleOrderService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NO_CONTENT);
    }
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
    try {
      return await this.saleOrderService.update(_id, updatedSaleOrder);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //This method remove the saleOrder if it does exist and returns an object
  @UseGuards(AuthGuard)
  @Delete(':saleOrder_id')
  @ApiOperation({
    summary: 'حذف سفارش فروش',
  })
  async deleteSaleOrder(@Query('saleOrder_id') saleOrder_id: string) {
    try {
      return await this.saleOrderService.remove(saleOrder_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Get('findByFilters')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله چندین فیلتر',
  })
  async findBySomeFilters(@Query('filters') filters: string) {
    const filtersObject: SaleOrderFilter = JSON.parse(filters);
    const saleOrderFilters = new SaleOrderFilter(filtersObject);
    const errors = await validate(saleOrderFilters);
    if (errors.length > 0) {
      throw new HttpException(errors[0].constraints, HttpStatus.BAD_REQUEST);
    } else if (errors.length == 0) {
      throw new HttpException(
        'no saleorders found with this filters',
        HttpStatus.NO_CONTENT,
      );
    } else {
      return await this.saleOrderService.multiFilter(saleOrderFilters);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':key')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله شناسه',
  })
  async findSaleOrderByKey(@Param('key') key: string) {
    return await MyDatabase.findByKey(
      key,
      'SaleOrders',
      'saleOrder doesnt exits',
    );
  }
}
