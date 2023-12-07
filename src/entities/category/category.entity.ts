import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Categories')
export class CategoryEntity extends ArangoDocument {
  @ApiProperty({ description: 'category id', example: '1' })
  id?: string;
  @ApiProperty({
    description: 'category name',
    example: 'صیفی جات',
  })
  name?: string;
  @ApiProperty({
    description: 'category parent id',
    example: '1',
  })
  parentId?: string;
  @ApiProperty({
    description: 'category description',
    example: 'این دسته بندی دارای میوه ها است',
  })
  description?: string;
  imageId: number;
}
