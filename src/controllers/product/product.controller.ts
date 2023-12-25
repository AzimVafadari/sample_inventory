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
  Query,
} from '@nestjs/common';
import { ArangoNewOldResult, ResultList } from 'nest-arango';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        product_id: {
          type: 'string',
          description: 'product pk',
          example: '1',
        },
        product_name: {
          type: 'string',
          description: 'نام محصول',
          example: 'موز',
        },
        supplier_id: {
          type: 'string',
          description: 'ایدی تامین کننده محصول',
          example: '2',
        },
        balance: {
          type: 'string',
          description: 'مقدار باقی مانده محصول در انبار',
          example: '5 کیلوگرم',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
        category_id: {
          type: 'string',
          description: 'آیدی دسته بندی',
          example: '1',
        },
        description: {
          type: 'string',
          description: 'توضیحات محصول',
          example: 'موز به انبار اضافه شد',
        },
        price: {
          type: 'number',
          description: 'قیمت',
          example: 1000,
        },
        expiry_date: {
          type: 'date',
          description: 'تاریخ انقضا محصول',
          example: new Date('2023-12-31'),
        },
        brand: {
          type: 'string',
          description: 'برند محصول',
          example: 'چی توز',
        },
      },
    },
  })
  async createProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() product: ProductEntity,
  ) {
    product.image_id = uuidv4();
    // const folderPath: string = './images/products';
    // const imageBuffer = image.buffer;
    // const imagePath = path.join(folderPath, `${product.image_id}.jpg`);
    // await fs.writeFile(imagePath, imageBuffer);
    return await this.productService.create(product);
  }

  @Get()
  @ApiOperation({
    summary: 'دریافت تمام محصولات',
  })
  async findAll(): Promise<ResultList<ProductEntity>> {
    return await this.productService.findAll();
  }

  @Put()
  @ApiOperation({
    summary: 'ویرایش محصول',
    requestBody: { description: 'string', content: null, required: true },
  })
  async update(@Body() product: ProductEntity): Promise<object> {
    return await this.productService.updateProduct(product);
  }

  @Delete(':product_id')
  @ApiOperation({
    summary: 'حذف محصول',
  })
  async remove(@Param('product_id') product_id: string): Promise<object> {
    return await this.productService.removeProduct(product_id);
  }
}
