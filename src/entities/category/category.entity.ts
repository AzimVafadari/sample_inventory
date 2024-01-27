import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
@Collection('Categories')
export class CategoryEntity extends ArangoDocument {
  @ApiProperty({
    description: 'نام دسته بندی',
    example: 'صیفی جات',
  })
  @IsString()
  category_name?: string;

  @ApiProperty({
    description: 'آیدی عکس دسته بندی',
    example: 'ffvddv5v5fdv5fdbvfd2',
  })
  @IsString()
  image_id: string;

  @ApiProperty({
    description: 'توضیحات دسته بندی',
    example: 'این دسته بندی دارای میوه ها است',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'آیدی پدر دسته بندی',
    example: '1',
  })
  @IsString()
  parent_id?: string;

  @ApiProperty({
    description: 'مسیر تا رسیدن به ریشه',
    example: '1.2.4',
  })
  @IsString()
  path_to_root?: string;
}
