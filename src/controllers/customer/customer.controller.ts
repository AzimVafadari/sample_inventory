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
import { CustomerService } from '../../services/customer/customer.service';
import { CustomerEntity } from '../../entities/customer/customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  //This method creates supplier if it doesn't exist and returns an object that says the status of creation
  @Post()
  @ApiOperation({
    summary: 'ایجاد مشتری',
  })
  async createSupplier(@Body() customer: CustomerEntity) {
    return await this.customerService.create(customer);
  }
  //This method is created to receive all suppliers
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی مشتریان',
  })
  async getAllSuppliers() {
    return await this.customerService.findAll();
  }
  //This method update the supplier by its updated form and returns an object that says the update status
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک مشتری به وسیله نام آن',
  })
  async updateSupplier(@Body() updatedCustomer: CustomerEntity) {
    return await this.customerService.update(updatedCustomer);
  }
  //This method remove the supplier if it does exist and returns an object
  @Delete(':customer_id')
  @ApiOperation({
    summary: 'حذف مشتری به وسیله آیدی آن',
  })
  async deleteSupplier(@Param('customer_id') customer_id: string) {
    return await this.customerService.remove(customer_id);
  }
  @Get(':customerName')
  @ApiOperation({
    summary: 'دریافت یک مشتری به وسیله نام آن',
  })
  async findSupplier(@Param('customerName') customerName: string) {
    return await this.customerService.findOne(customerName);
  }
}
