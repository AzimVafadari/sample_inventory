import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  // UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import {
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
// import { AuthGuard } from '../../auth/auth.guard';
@ApiTags('category')
// @ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  // @UseGuards(AuthGuard)
  @Post()
  async createCategory(@Body() category: CategoryEntity) {
    category.path_to_root = '';
    return await this.categoryService.create(category);
  }

  @Post('uploadProductImage')
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
  async uploadProductImage(@UploadedFile() image: Express.Multer.File) {
    const imageId = uuidv4();
    const folderPath: string = './images/products/';
    const imageBuffer = image.buffer;
    const imagePath = path.join(folderPath, `${imageId}.jpg`);
    await fs.writeFile(imagePath, imageBuffer);
    return await imageId;
  }
  // @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمام دسته بندی ها',
  })
  async findAllCategory() {
    return await this.categoryService.findAll();
  }
  // @UseGuards(AuthGuard)
  @Get(':categoryName')
  @ApiOperation({
    summary: 'دریافت دسته بندی با نام ',
  })
  async findCategoriesByName(@Param('categoryName') categoryName: string) {
    return await this.categoryService.findOne(categoryName);
  }
  // @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش دسته بندی',
  })
  async updateCategory(
    @Body() category: CategoryEntity,
    @Query('_id') _id: string,
  ) {
    return await this.categoryService.update(_id, category);
  }
  // @UseGuards(AuthGuard)
  @Delete(':categoryId')
  @ApiOperation({
    summary: 'حذف دسته بندی',
  })
  async removeCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<object> {
    return await this.categoryService.remove(categoryId);
  }
}
