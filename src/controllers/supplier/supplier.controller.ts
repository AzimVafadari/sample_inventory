import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation } from '@nestjs/swagger';
import { SupplierEntity } from 'src/entities/supplier/supplier.entity';
import { SupplierService } from 'src/services/supplier/supplier.service';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}
  //This method creates supplier if it doesn't exist and returns an object that says the status of creation
  @Post()
  @ApiOperation({
    summary: 'ایجاد تامین کننده',
  })
  async createSupplier(@Body() supplier: SupplierEntity) {
    return await this.supplierService.create(supplier);
  }
  //This method is created to receive all suppliers
  @Get()
  @ApiOperation({
    summary: 'دریافت تمامی تامین کنندگان',
  })
  async getAllSuppliers() {
    return await this.supplierService.findAll();
  }
  //This method update the supplier by its updated form and returns an object that says the update status
  @Put()
  @ApiOperation({
    summary: 'ویرایش یک تامین کننده به وسیله نام آن',
  })
  async updateSupplier(@Body() updatedSupplier: SupplierEntity) {
    return await this.supplierService.update(updatedSupplier);
  }
  //This method remove the supplier if it does exist and returns an object
  @Delete(':supplier_id')
  @ApiOperation({
    summary: 'حذف تامین کننده به وسیله آیدی آن',
  })
  async deleteSupplier(@Param('supplier_id') supplier_id: string) {
    return await this.supplierService.remove(supplier_id);
  }
}
