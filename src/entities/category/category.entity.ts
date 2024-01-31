import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
@Collection('Categories')
export class CategoryEntity extends ArangoDocument {
  @ApiProperty({
    description: 'نام دسته بندی',
    example: 'صیفی جات',
  })
  @IsString()
  @Length(3, 25)
  category_name: string;

  @ApiProperty({
    description: 'آیدی عکس دسته بندی',
    example: '1d9d6afa-923d-4e5d-85f2-e83a8f1d7809',
  })
  @IsOptional()
  @IsUUID()
  image_id: string;

  @ApiProperty({
    description: 'توضیحات دسته بندی',
    example: 'این دسته بندی دارای میوه ها است',
  })
  @IsString()
  @IsOptional()
  @Length(0, 70)
  description: string;

  @ApiProperty({
    description: 'آیدی پدر دسته بندی',
    example: '',
  })
  @IsString()
  parent_id: string;

  path_to_root: string;
}
