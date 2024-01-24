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
  ParseIntPipe, UsePipes, ValidationPipe
  // UseGuards,
} from "@nestjs/common";
import { ResultList } from 'nest-arango';
import {
  // ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'class-validator';

// import { AuthGuard } from '../../auth/auth.guard';
@ApiTags('product')
// @ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @UseGuards(AuthGuard)
  @Post()
  // @UsePipes(new ValidationPipe({ transform: true }))
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
          type: 'number',
          description: 'مقدار باقی مانده محصول در انبار',
          example: 5,
        },
        scale: {
          type: 'string',
          description: 'مقیاس موجودی مخصول',
          example: 'کیلوگرم',
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
          example: 10000,
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
    const folderPath: string = './images/products/';
    const imageBuffer = image.buffer;
    const imagePath = path.join(folderPath, `${product.image_id}.jpg`);
    await fs.writeFile(imagePath, imageBuffer);
    return await this.productService.create(product);
  }

  // @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمام محصولات',
  })
  async findAll(): Promise<ResultList<ProductEntity>> {
    return await this.productService.findAll();
  }

  // @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش محصول',
    requestBody: { description: 'string', content: null, required: true },
  })
  async updateProduct(@Body() product: ProductEntity): Promise<object> {
    return await this.productService.updateProduct(product);
  }

  // @UseGuards(AuthGuard)
  @Delete(':product_id')
  @ApiOperation({
    summary: 'حذف محصول',
  })
  async removeProduct(
    @Param('product_id') product_id: string,
  ): Promise<object> {
    return await this.productService.removeProduct(product_id);
  }

  @Get('filterByBalance')
  @ApiOperation({
    summary: 'فیلتر محصولات بر اساس موجودی',
  })
  async filterByBalance(
    @Query('lowBalance', new ParseIntPipe()) lowBalance: number,
    @Query('highBalance', new ParseIntPipe()) highBalance: number,
  ) {
    return await this.productService.filterByBalance(lowBalance, highBalance);
  }

  @Get('filterBySupplierID')
  @ApiOperation({
    summary: 'فیلتر مخصولات بر اساس ایدی تامین کننده',
  })
  async filterBySupplierId(@Query('supplierId') supplierId: string) {
    return await this.productService.filterBySupplier(supplierId);
  }

  @Get('findById/:productId')
  @ApiOperation({
    summary: 'یافتن یک محصول با ایدی',
  })
  async findById(@Param('productId') productId: string) {
    return await this.productService.findById(productId);
  }

  @Get('findByName')
  @ApiOperation({
    summary: 'یافتن یک محصول با نام ان',
  })
  async findByProductName(@Query('productName') productName: string) {
    return this.productService.findByProductName(productName);
  }

  @Get('findByCategory')
  @ApiOperation({
    summary: 'یافتن محصولات موجود در یک دسته بندی',
  })
  async findByCategory(@Query('categoryId') categoryId: string) {
    return await this.productService.findByCategory(categoryId);
  }

  @Get('getExpiredProducts')
  @ApiOperation({
    summary: 'یافتن محصولات منقضی شده بر اساس تاریخ',
  })
  async findExpiredProductsBasedDate(
    @Query('beginDate') beginDate?: string,
    @Query('enddate') enddate?: string,
  ) {
    return await this.productService.findExpiredProductsBasedDate(
      beginDate,
      enddate,
    );
  }

  @Get('findByPrice')
  @ApiOperation({
    summary: 'یافتن محصولات بر اساس قیمت',
  })
  async findByPrice(
    @Query('lowPrice') lowPrice?: number,
    @Query('highPrice') highPrice?: number,
  ) {
    return await this.productService.fillterByPrice(lowPrice, highPrice);
  }
}
