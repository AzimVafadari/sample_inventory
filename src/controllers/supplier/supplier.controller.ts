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
import { SupplierEntity } from 'src/entities/supplier/supplier.entity';
import { SupplierService } from 'src/services/supplier/supplier.service';

import { AuthGuard } from '../../auth/auth.guard';
@ApiTags('supplier')
@ApiBearerAuth()
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  //This method creates supplier if it doesn't exist and returns an object that says the status of creation
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'ایجاد تامین کننده',
  })
  async createSupplier(@Body() supplier: SupplierEntity) {
    return await this.supplierService.create(supplier);
  }

  //This method is created to receive all suppliers
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی تامین کنندگان',
  })
  async getAllSuppliers() {
    return await this.supplierService.findAll();
  }

  //This method update the supplier by its updated form and returns an object that says the update status
  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک تامین کننده به وسیله نام آن',
  })
  async updateSupplier(
    @Body() updatedSupplier: SupplierEntity,
    @Query('_id') _id: string,
  ) {
    return await this.supplierService.update(_id, updatedSupplier);
  }

  //This method remove the supplier if it does exist and returns an object
  @UseGuards(AuthGuard)
  @Delete(':supplier_id')
  @ApiOperation({
    summary: 'حذف تامین کننده به وسیله آیدی آن',
  })
  async deleteSupplier(@Param('supplier_id') supplier_id: string) {
    return await this.supplierService.remove(supplier_id);
  }

  @Get('supplierName')
  @ApiOperation({
    summary: 'دریافت یک تامین کننده به وسیله نام آن',
  })
  @UseGuards(AuthGuard)
  async findSupplier(@Query('supplierName') supplierName: string) {
    if (supplierName === '.') {
      return { error: 'نام تامین کننده نامعتبر است' };
    }
    return await this.supplierService.findOne(supplierName);
  }
}
