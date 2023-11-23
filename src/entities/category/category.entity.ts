import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Categories')
export class CategoryEntity extends ArangoDocument {
  @ApiProperty({ description: 'category id', example: '1' })
  id?: number;
  @ApiProperty({
    description: 'category name',
    example: 'صیفی جات',
  })
  categoryName?: string;
  @ApiProperty({
    description: 'category parent id',
    example: '1',
  })
  parentId?: number;
  @ApiProperty({
    description: 'category description',
    example: 'این دسته بندی دارای میوه ها است',
  })
  description?: string;
  @ApiProperty({
    description: 'category image',
  })
  image: Buffer;
}
