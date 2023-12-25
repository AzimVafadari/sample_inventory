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
import { SaleOrderEntity } from '../../../entities/order/sale/sale-order.entity';
import { SaleOrderService } from '../../../services/order/sale/sale-order.service';
@ApiTags('sale-order')
@Controller('sale-order')
export class SaleOrderController {
  constructor(private readonly saleOrderService: SaleOrderService) {}
  //This method creates saleOrder if it doesn't exist and returns an object that says the status of creation
  @Post()
  @ApiOperation({
    summary: 'ایجاد سفارش فروش',
  })
  async createSaleOrder(@Body() saleOrder: SaleOrderEntity) {
    return await this.saleOrderService.create(saleOrder);
  }
  //This method is created to receive all saleOrders
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی سفارش های فروش',
  })
  async getAllSaleOrders() {
    return await this.saleOrderService.findAll();
  }
  //This method update the saleOrder by its updated form and returns an object that says the update status
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک سفارش فروش',
  })
  async updateSaleOrder(@Body() updatedSaleOrder: SaleOrderEntity) {
    return await this.saleOrderService.update(updatedSaleOrder);
  }
  //This method remove the saleOrder if it does exist and returns an object
  @Delete(':saleOrder_id')
  @ApiOperation({
    summary: 'حذف سفارش فروش',
  })
  async deleteSaleOrder(@Param('saleOrder_id') saleOrder_id: string) {
    return await this.saleOrderService.remove(saleOrder_id);
  }
  @Get(':status')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله وضعیت آن',
  })
  async findSaleOrderByStatus(@Param('status') status: string) {
    return await this.saleOrderService.findManyByStatus(status);
  }
  @Get(':productId')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله آیدی محصول آن',
  })
  async findSaleOrderByProductId(@Param('productId') productId: string) {
    return await this.saleOrderService.findManyByProductId(productId);
  }
  @Get(':customerId')
  @ApiOperation({
    summary: 'دریافت یک سفارش فروش به وسیله آیدی فروشنده آن',
  })
  async findSaleOrderBySupplierId(@Param('customerId') customerId: string) {
    return await this.saleOrderService.findManyByCustomerId(customerId);
  }
}
