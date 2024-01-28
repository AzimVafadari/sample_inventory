import {
  Body,
  Controller,
  Delete,
  Get,
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
  @Get('findBasedOnStatus')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله وضعیت آن',
  })
  async findSaleOrderByStatus(@Query('status') status: string) {
    return await this.saleOrderService.findManyByStatus(status);
  }

  @UseGuards(AuthGuard)
  @Get('findBasedOnProductId')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله آیدی محصول آن',
  })
  async findSaleOrderByProductId(@Query('productId') productId: string) {
    return await this.saleOrderService.findManyByProductId(productId);
  }

  @UseGuards(AuthGuard)
  @Get('findBasedOnCustomerId')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله آیدی فروشنده آن',
  })
  async findSaleOrderBySupplierId(@Query('customerId') customerId: string) {
    return await this.saleOrderService.findManyByCustomerId(customerId);
  }

  @UseGuards(AuthGuard)
  @Get('findBasedOnSomeFilters')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله چندین فیلتر',
  })
  async findSaleOrderBySomeFilters(@Body() filter: SaleOrderFilter) {
    return await this.saleOrderService.multiFilter(filter);
  }
}
