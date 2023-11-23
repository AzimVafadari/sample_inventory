import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ArangoNewOldResult, ResultList } from 'nest-arango';
import { ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product/product.entity';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @ApiOperation({
    summary: 'ایجاد محصول',
    requestBody: { description: 'string', content: null, required: true },
  })
  async create(@Body() product: ProductEntity): Promise<ProductEntity> {
    return await this.productService.create(product);
  }

  @Get()
  @ApiOperation({
    summary: 'دریافت تمام محصولات',
  })
  async findAll(): Promise<ResultList<ProductEntity>> {
    return await this.productService.findAll();
  }

  @Get(':productName')
  @ApiOperation({
    summary: 'دریافت محصول با نام محصولی',
  })
  async findOne(
    @Param('productName') productName: string,
  ): Promise<ProductEntity | null> {
    return await this.productService.findOne(productName);
  }

  @Put(':productName')
  @ApiOperation({
    summary: 'ویرایش محصول',
    requestBody: { description: 'string', content: null, required: true },
  })
  async update(
    @Param('productName') productName: string,
    @Body() product: ProductEntity,
  ): Promise<ArangoNewOldResult<any>> {
    return await this.productService.update(productName, product);
  }

  @Delete(':productName')
  @Put(':productName')
  @ApiOperation({
    summary: 'حذف محصول',
  })
  async remove(@Param('productName') productName: string): Promise<void> {
    return await this.productService.remove(productName);
  }
}
