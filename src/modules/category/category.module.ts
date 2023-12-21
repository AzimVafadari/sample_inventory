import { Module } from '@nestjs/common';
import { CategoryController } from '../../controllers/category/category.controller';
import { CategoryService } from '../../services/category/category.service';
import { CategoryEntity } from '../../entities/category/category.entity';

@Module({
  imports: [CategoryEntity],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
