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
import { CustomerService } from '../../services/customer/customer.service';
import { CustomerEntity } from '../../entities/customer/customer.entity';
import { AuthGuard } from '../../auth/auth.guard';
import { MyDatabase } from '../../database/database';
@ApiTags('customer')
@ApiBearerAuth()
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  //This method creates Customer if it doesn't exist and returns an object that says the status of creation
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'ایجاد مشتری',
  })
  async createCustomer(@Body() customer: CustomerEntity) {
    return await this.customerService.create(customer);
  }
  //This method is created to receive all Customers
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی مشتریان',
  })
  async getAllCustomers() {
    const customers = await this.customerService.findAll();
    if (customers.totalCount == 0) {
      throw new HttpException('Customer not found', HttpStatus.NO_CONTENT);
    }
    return customers;
  }
  //This method update the Customer by its updated form and returns an object that says the update status
  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک مشتری به وسیله نام آن',
  })
  async updateCustomer(
    @Body() updatedCustomer: CustomerEntity,
    @Query('_id') _id: string,
  ) {
    try {
      return await this.customerService.update(_id, updatedCustomer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  //This method remove the Customer if it does exist and returns an object
  @UseGuards(AuthGuard)
  @Delete(':customer_key')
  @ApiOperation({
    summary: 'حذف مشتری به وسیله آیدی آن',
  })
  async deleteCustomer(@Param('customer_key') customer_key: string) {
    try {
      return await this.customerService.remove(customer_key);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @UseGuards(AuthGuard)
  @Get('findByName/:customerName')
  @ApiOperation({
    summary: 'دریافت یک مشتری به وسیله نام آن',
  })
  async findBasedName(@Param('customerName') customerName: string) {
    try {
      return await this.customerService.findBasedName(customerName);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @UseGuards(AuthGuard)
  @Get(':key')
  @ApiOperation({
    summary: 'دریافت یک مشتری به وسیله کلید آن',
  })
  async findBasedKey(@Param('key') key: string) {
    try {
      return await MyDatabase.findByKey(
        key,
        'Customers',
        'customer doesnt exist',
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
