import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Categories')
export class CategoryEntity extends ArangoDocument {
  @ApiProperty({ description: 'category id', example: '1' })
  category_id?: string;
  @ApiProperty({
    description: 'category name',
    example: 'صیفی جات',
  })
  category_name?: string;
  @ApiProperty({
    description: 'category parent id',
    example: '1',
  })
  parent_id?: string;
  @ApiProperty({
    description: 'category description',
    example: 'این دسته بندی دارای میوه ها است',
  })
  description?: string;
  image_id: number;
}
