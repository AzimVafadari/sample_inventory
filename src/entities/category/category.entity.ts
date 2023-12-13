import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
@Collection('Categories')
export class CategoryEntity extends ArangoDocument {
  @ApiProperty({ description: 'آیدی دسته بندی', example: '1' })
  category_id?: string;

  @ApiProperty({
    description: 'نام دسته بندی',
    example: 'صیفی جات',
  })
  category_name?: string;

  image_id: number;

  @ApiProperty({
    description: 'توضیحات دسته بندی',
    example: 'این دسته بندی دارای میوه ها است',
  })
  description?: string;

  @ApiProperty({
    description: 'آیدی پدر دسته بندی',
    example: '1',
  })
  parent_id?: string;

  @ApiProperty({
    description: 'مسیر تا رسیدن به ریشه',
    example: '1.2.4',
  })
  path_to_root?: string;
}
