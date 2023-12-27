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
    const newCategory = await this.categoryRepository.save(category);
    //If category collection size is one category path_to_root is its _key
    if ((await MyDatabase.getCollectionSize('Categories')) == 1) {
      newCategory.path_to_root = newCategory._key;
    } else {
      const parentCategory = await MyDatabase.getDb().query(aql`
      FOR category IN Categories
      FILTER category._key == ${newCategory.parent_id}
      RETURN category
    `);
      const pc: CategoryEntity = await parentCategory.next();
      newCategory.path_to_root = pc.path_to_root + '.' + newCategory._key;
    }
    await this.update(newCategory);
    return { result: 'the category is created' };
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
        FILTER cat._key == ${updatedCategory._key}
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

  async remove(categoryKey: string): Promise<object> {
    //Find category
    const cursor = await MyDatabase.getDb().query(aql`
    FOR cat IN Categories
    FILTER cat._key == ${categoryKey}
    RETURN cat
    `);
    //This query is better that be updated later...
    const deletedDocument = await MyDatabase.getDb().query(aql`
    FOR cat IN Categories
    FILTER cat._key == ${categoryKey}
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
