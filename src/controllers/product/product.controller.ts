import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ArangoNewOldResult, ResultList } from 'nest-arango';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        price: {
          type: 'number',
        },
        priceScale: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
        categoriesId: {
          type: 'string',
          format: 'array',
        },
        initial_balance: {
          type: 'number',
        },
        current_balance: {
          type: 'number',
        },
        expiry_date: {
          type: 'date',
        },
        comments: {
          type: 'date',
          format: 'array',
        },
      },
    },
  })
  async createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() product: ProductEntity,
  ) {
    product.imageId = uuidv4();
    const folderPath: string = './images/products';
    const imageBuffer = image.buffer;
    const imagePath = path.join(folderPath, `${product.imageId}.jpg`);
    await fs.writeFile(imagePath, imageBuffer);
    return await this.productService.create(product);
  }

  @Get()
  @ApiOperation({
    summary: 'دریافت تمام محصولات',
  })
  async findAll(): Promise<ResultList<ProductEntity>> {
    return await this.productService.findAll();
  }

  @Get(':name')
  @ApiOperation({
    summary: 'دریافت محصول با نام محصول',
  })
  async findOne(@Param('name') name: string): Promise<ProductEntity | null> {
    return await this.productService.findOne(name);
  }

  @Put(':name')
  @ApiOperation({
    summary: 'ویرایش محصول',
    requestBody: { description: 'string', content: null, required: true },
  })
  async update(
    @Param('name') name: string,
    @Body() product: ProductEntity,
  ): Promise<ArangoNewOldResult<any>> {
    return await this.productService.update(name, product);
  }

  @Delete(':name')
  @Put(':name')
  @ApiOperation({
    summary: 'حذف محصول',
  })
  async remove(@Param('name') name: string): Promise<void> {
    return await this.productService.remove(name);
  }
}
