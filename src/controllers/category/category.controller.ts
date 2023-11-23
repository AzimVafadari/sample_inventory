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
import { CategoryService } from '../../services/category/category.service';
import { CategoryEntity } from '../../entities/category/category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categoryName: {
          type: 'string',
        },
        parentId: {
          type: 'integer',
        },
        description: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() categoryData: CategoryEntity,
  ) {
    console.log('Uploaded File:', file);
    console.log('Category Data:', categoryData);
  }
  @Get()
  @ApiOperation({
    summary: 'دریافت تمام محصولات',
  })
  async findAll(): Promise<ResultList<CategoryEntity>> {
    return await this.categoryService.findAll();
  }

  @Get(':categoryName')
  @ApiOperation({
    summary: 'دریافت دسته بندی با نام ',
  })
  async findOne(
    @Param('categoryName') categoryName: string,
  ): Promise<CategoryEntity | null> {
    return await this.categoryService.findOne(categoryName);
  }

  @Put(':categoryName')
  @ApiOperation({
    summary: 'ویرایش دسته بندی',
    requestBody: { description: 'string', content: null, required: true },
  })
  async update(
    @Param('categoryName') categoryName: string,
    @Body() Category: CategoryEntity,
  ): Promise<ArangoNewOldResult<any>> {
    return await this.categoryService.update(categoryName, Category);
  }

  @Delete(':categoryName')
  @Put(':categoryName')
  @ApiOperation({
    summary: 'حذف دسته بندی',
  })
  async remove(@Param('categoryName') categoryName: string): Promise<void> {
    return await this.categoryService.remove(categoryName);
  }
}
