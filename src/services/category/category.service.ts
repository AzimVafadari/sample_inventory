import { Injectable, NotFoundException } from '@nestjs/common';
import {
  InjectRepository,
  ArangoRepository,
  ResultList,
  ArangoNewOldResult,
} from 'nest-arango';
import { CategoryEntity } from '../../entities/category/category.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly CategoryRepository: ArangoRepository<CategoryEntity>,
  ) {}

  async create(Category: CategoryEntity): Promise<CategoryEntity> {
    return await this.CategoryRepository.save(Category);
  }

  async findAll(): Promise<ResultList<CategoryEntity>> {
    return await this.CategoryRepository.findAll();
  }

  async findOne(categoryName: string): Promise<CategoryEntity | null> {
    return await this.CategoryRepository.findOneBy({ categoryName });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(
    categoryName: string,
    updatedCategory: Partial<CategoryEntity>,
  ): Promise<ArangoNewOldResult<any>> {
    // Find the existing Category
    const existingCategory = await this.CategoryRepository.findOneBy({
      categoryName,
    });

    if (!existingCategory) {
      throw new NotFoundException(
        `Category with categoryName ${categoryName} not found`,
      );
    }

    // Update the Category fields
    Object.assign(existingCategory, updatedCategory);

    // Use the `update` method to persist changes
    const updatedDocument =
      await this.CategoryRepository.update(existingCategory);

    // Return the updated Category
    return updatedDocument ? updatedDocument : null;
  }

  async remove(categoryName: string): Promise<void> {
    await this.CategoryRepository.removeBy({ categoryName });
  }
}
