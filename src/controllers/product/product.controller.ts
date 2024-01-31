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
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Res,
} from '@nestjs/common';
import { ResultList } from 'nest-arango';
import {
  ApiBearerAuth,
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
import { createReadStream } from 'fs';
import { AuthGuard } from '../../auth/auth.guard';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';
import { Response } from 'express';
import { ProductFilter } from '../../interfaces/product/product-filter';
import { validate } from 'class-validator';
@ApiTags('product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'ساخت محصول',
  })
  async createProduct(@Body() product: ProductEntity) {
    return await this.productService.create(product);
  }
  @UseGuards(AuthGuard)
  @Post('upLoadProductImage')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'jpeg' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const imageId = uuidv4();
    const folderPath: string = './images/products/';
    const imageBuffer = image.buffer;
    const imagePath = path.join(folderPath, `${imageId}.jpg`);
    await fs.writeFile(imagePath, imageBuffer);
    return await imageId;
  }
  @Get('downLoadProductImage')
  @UseGuards(AuthGuard)
  async getImage(@Query('imageId') imageId: string, @Res() res: Response) {
    const folderPath: string = './images/products/';
    const imagePath = path.join(folderPath, `${imageId}.jpg`);
    const isExist = fileExistsSync(imagePath);
    if (isExist) {
      const file = createReadStream(imagePath);
      file.pipe(res.set('content-type', 'image/jpeg'));
    } else {
      res.status(422).send({ error: 'image not found' });
    }
  }
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمام محصولات',
  })
  async findAll(): Promise<ResultList<ProductEntity>> {
    return await this.productService.findAll();
  }

  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش محصول',
    requestBody: { description: 'string', content: null, required: true },
  })
  async updateProduct(@Body() product: ProductEntity): Promise<object> {
    return await this.productService.updateProduct(product);
  }

  @UseGuards(AuthGuard)
  @Delete(':product_id')
  @ApiOperation({
    summary: 'حذف محصول',
  })
  async removeProduct(
    @Param('product_id') product_id: string,
  ): Promise<object> {
    return await this.productService.removeProduct(product_id);
  }

  @UseGuards(AuthGuard)
  @Get('findByFilters')
  @ApiOperation({
    summary: 'دریافت محصولات با فیلتر',
  })
  async findBySomeFilter(@Query('filters') filters: string) {
    const filtersObject: ProductFilter = JSON.parse(filters);
    const productFilters = new ProductFilter(filtersObject);
    const errors = await validate(productFilters);
    if (errors.length > 0) {
      return { error: errors };
    } else {
      return await this.productService.multiFilter(filtersObject);
    }
  }

  @UseGuards(AuthGuard)
  @Get('findById/:productId')
  @ApiOperation({
    summary: 'یافتن یک محصول با ایدی',
  })
  async findById(@Param('productId') productId: string) {
    return await this.productService.findById(productId);
  }
  @UseGuards(AuthGuard)
  @Get('findByName')
  @ApiOperation({
    summary: 'یافتن یک محصول با نام ان',
  })
  async findByProductName(@Query('productName') productName: string) {
    return this.productService.findByProductName(productName);
  }
}
