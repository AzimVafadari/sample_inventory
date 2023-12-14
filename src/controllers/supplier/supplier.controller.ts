import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SupplierEntity } from 'src/entities/supplier/supplier.entity';
import { SupplierService } from 'src/services/supplier/supplier.service';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}
  @Post()
  @ApiOperation({
    summary: 'ایجاد تامین کننده',
  })
  async create(@Body() supplier: SupplierEntity) {
    return await this.supplierService.create(supplier);
  }
}
