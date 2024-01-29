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
import { CustomerService } from '../../services/customer/customer.service';
import { CustomerEntity } from '../../entities/customer/customer.entity';
import { AuthGuard } from '../../auth/auth.guard';
import { MyDatabase } from '../../database/database';
@ApiTags('customer')
@ApiBearerAuth()
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  //This method creates supplier if it doesn't exist and returns an object that says the status of creation
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'ایجاد مشتری',
  })
  async createSupplier(@Body() customer: CustomerEntity) {
    return await this.customerService.create(customer);
  }
  //This method is created to receive all suppliers
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی مشتریان',
  })
  async getAllSuppliers() {
    return await this.customerService.findAll();
  }
  //This method update the supplier by its updated form and returns an object that says the update status
  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک مشتری به وسیله نام آن',
  })
  async updateSupplier(
    @Body() updatedCustomer: CustomerEntity,
    @Query('_id') _id: string,
  ) {
    return await this.customerService.update(_id, updatedCustomer);
  }
  //This method remove the supplier if it does exist and returns an object
  @UseGuards(AuthGuard)
  @Delete(':customer_id')
  @ApiOperation({
    summary: 'حذف مشتری به وسیله آیدی آن',
  })
  async deleteSupplier(@Param('customer_id') customer_id: string) {
    return await this.customerService.remove(customer_id);
  }
  @UseGuards(AuthGuard)
  @Get('findByName/:customerName')
  @ApiOperation({
    summary: 'دریافت یک مشتری به وسیله نام آن',
  })
  async findBasedName(@Param('customerName') customerName: string) {
    return await this.customerService.findBasedName(customerName);
  }
  @UseGuards(AuthGuard)
  @Get(':key')
  @ApiOperation({
    summary: 'دریافت یک مشتری به وسیله کلید آن',
  })
  async findBasedKey(@Param('key') key: string) {
    return await MyDatabase.findByKey(
      key,
      'Customers',
      'customer doesnt exist',
    );
  }
}
