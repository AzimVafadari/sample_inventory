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
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category_id: {
          type: 'string',
          example: '2',
        },
        category_name: {
          type: 'string',
          example: 'صیفی جات',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
          example: 'این دسته بندی دارای میوه ها است',
        },
        parent_id: {
          type: 'string',
          example: '1',
        },
        path_to_root: {
          type: 'string',
          example: '1.2',
        },
      },
    },
  })
  async createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() category: CategoryEntity,
  ) {
    category.image_id = uuidv4();
    const folderPath: string = './images/categories';
    const imageBuffer = image.buffer;
    const imagePath = path.join(folderPath, `${category.image_id}.jpg`);
    await fs.writeFile(imagePath, imageBuffer);
    return await this.categoryService.create(category);
  }
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'دریافت تمام دسته بندی ها',
  })
  async findAllCategory() {
    return await this.categoryService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':categoryName')
  @ApiOperation({
    summary: 'دریافت دسته بندی با نام ',
  })
  async findCategoriesByName(@Param('categoryName') categoryName: string) {
    return await this.categoryService.findOne(categoryName);
  }
  @UseGuards(AuthGuard)
  @Put()
  @ApiOperation({
    summary: 'ویرایش دسته بندی',
  })
  async updateCategory(@Body() category: CategoryEntity) {
    return await this.categoryService.update(category);
  }
  @UseGuards(AuthGuard)
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
