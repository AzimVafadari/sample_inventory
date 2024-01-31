import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
  Query,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  // ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from '../../services/category/category.service';
import { CategoryEntity } from '../../entities/category/category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AuthGuard } from '../../auth/auth.guard';
import { createReadStream } from 'fs';
import { MyDatabase } from '../../database/database';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';
import { Response } from 'express';
@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'ساخت دسته بندی',
  })
  @Post()
  async createCategory(@Body() category: CategoryEntity) {
    category.path_to_root = '';
    try {
      return await this.categoryService.create(category);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('upLoadCategoryImage')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'بارگذاری تصویر دسته بندی',
  })
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
    const folderPath: string = './images/categories/';
    const imageBuffer = image.buffer;
    const imagePath = path.join(folderPath, `${imageId}.jpg`);
    await fs.writeFile(imagePath, imageBuffer);
    return await imageId;
  }
  @Get('downLoadCategoryImage')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'دریافت تصویر دسته بندی',
  })
  async getImage(@Query('imageId') imageId: string, @Res() res: Response) {
    const folderPath: string = './images/categories/';
    const imagePath = path.join(folderPath, `${imageId}.jpg`);
    const isExist = fileExistsSync(imagePath);
    if (isExist) {
      const file = createReadStream(imagePath);
      file.pipe(res.set('Content-Type', 'image/jpeg'));
    } else {
      res.status(422).send({ error: 'image not found' });
    }
  }
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمام دسته بندی ها',
  })
  async findAllCategory() {
    const categories = await this.categoryService.findAll();
    if (categories.totalCount == 0) {
      throw new HttpException('Category not found', HttpStatus.NO_CONTENT);
    }
    return categories;
  }
  @UseGuards(AuthGuard)
  @Get('/categoryName')
  @ApiOperation({
    summary: 'دریافت دسته بندی با نام ',
  })
  async findCategoriesByName(@Query('categoryName') categoryName: string) {
    try {
      return await this.categoryService.findByName(categoryName);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش دسته بندی',
  })
  async updateCategory(
    @Body() category: CategoryEntity,
    @Query('_id') _id: string,
  ) {
    try {
      return await this.categoryService.update(_id, category);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  @UseGuards(AuthGuard)
  @Delete(':key')
  @ApiOperation({
    summary: 'حذف دسته بندی',
  })
  async removeCategory(@Param('key') key: string): Promise<object> {
    try {
      return await this.categoryService.remove(key);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  @UseGuards(AuthGuard)
  @Get(':key')
  @ApiOperation({
    summary: 'دریافت دسته بندی با کلید',
  })
  async findByKey(@Param('key') key: string) {
    try {
      return await MyDatabase.findByKey(
        key,
        'Categories',
        'Category not found',
      );
    } catch (error) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  }
}
