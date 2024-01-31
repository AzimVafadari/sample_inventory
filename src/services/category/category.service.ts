import { Injectable, NotFoundException } from '@nestjs/common';
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
    const parentCategory = await MyDatabase.getDb().query(aql`
      FOR category IN Categories
      FILTER category._key == ${category.parent_id}
      RETURN category
    `);
    const pc: CategoryEntity = await parentCategory.next();
    if (!pc && category.parent_id != '') {
      return { error: 'parent category not found' };
    }
    const newCategory = await this.categoryRepository.save(category);
    if (category.parent_id == '') {
      newCategory.path_to_root = newCategory._key;
    } else {
      newCategory.path_to_root = pc.path_to_root + '.' + newCategory._key;
    }
    //If category collection size is one category path_to_root is its _id
    await this.update(newCategory._id, newCategory);
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
      throw new NotFoundException('Category not found');
    }
  }

  async update(_id: string, updatedCategory: CategoryEntity): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR cat IN Categories
        FILTER cat._id == ${_id}
        UPDATE cat WITH ${updatedCategory} IN Categories
        RETURN OLD
    `);
    const isUpdated = await updatedDocument.next();
    if (isUpdated) {
      return { message: 'The category is successfully updated.' };
    } else {
      throw new NotFoundException('Category not found');
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
      throw new NotFoundException('Category not found');
    }
  }
}
