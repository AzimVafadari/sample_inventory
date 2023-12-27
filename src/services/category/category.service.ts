import { Injectable } from '@nestjs/common';
import { InjectRepository, ArangoRepository } from 'nest-arango';
import { CategoryEntity } from '../../entities/category/category.entity';
import { MyDatabase } from '../../database/database';
import { aql } from 'arangojs';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: ArangoRepository<CategoryEntity>,
  ) {}

  async create(category: CategoryEntity): Promise<object> {
    const cursor = await MyDatabase.getDb().query(aql`
    FOR category IN Categories
    FILTER category.category_id == ${category.category_id}
    RETURN category
  `);
    const isExist = cursor.all();
    if ((await isExist).length > 0) {
      return { error: 'category already exist' };
    } else {
      await this.categoryRepository.save(category);
      return { result: 'the category is created' };
    }
  }

  async findAll() {
    return await this.categoryRepository.findAll();
  }

  async findOne(categoryName: string): Promise<object> {
    //This query search all customers that their name starts with customerName
    //ChatGPT did this query
    const category = await MyDatabase.getDb().query(aql`
    FOR category IN Categories
    FILTER LIKE(category.category_name, CONCAT(${categoryName}, '%'))
    RETURN category
    `);
    const isExist = category.all();
    if ((await isExist).length > 0 && categoryName !== '.') {
      return isExist;
    } else {
      return { error: 'category not found' };
    }
  }
  async update(updatedCategory: CategoryEntity): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR cat IN Categories 
        FILTER cat.category_id == ${updatedCategory.category_id}
        UPDATE cat._key WITH ${updatedCategory} IN Categories
        RETURN OLD
    `);
    const isUpdated = await updatedDocument.next();
    if (isUpdated) {
      return { message: 'The category is successfully updated.' };
    } else {
      return { error: 'category not found' };
    }
  }

  async remove(categoryId: string): Promise<object> {
    //Find category
    const cursor = await MyDatabase.getDb().query(aql`
    FOR cat IN Categories
    FILTER cat.category_id == ${categoryId}
    RETURN cat
    `);
    //This query is better that be updated later...
    const deletedDocument = await MyDatabase.getDb().query(aql`
    FOR cat IN Categories
    FILTER cat.category_id == ${categoryId}
    REMOVE cat IN Categories
    RETURN OLD
    `);
    const isDeleted = await deletedDocument.all();
    const category: CategoryEntity = await cursor.next();
    if (isDeleted.length > 0) {
      //Get children of the category
      await MyDatabase.getDb().query(aql`
       FOR category IN Categories
       FILTER LIKE(category.path_to_root, CONCAT(${category.path_to_root}, '%'))
       RETURN category
      `);
      //Delete all children of the category
      await MyDatabase.getDb().query(aql`
       FOR category IN Categories
       FILTER LIKE(category.path_to_root, CONCAT(${category.path_to_root}, '%'))
       REMOVE category IN Categories
      `);
      return { message: 'category and its products successfully deleted' };
    } else {
      return { error: 'category not found' };
    }
  }
}
