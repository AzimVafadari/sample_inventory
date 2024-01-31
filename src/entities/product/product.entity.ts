import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import {
  Contains,
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
enum scale {
  kg = 'kg',
  g = 'g',
  pieces = 'pieces',
  ton = 'ton',
}
@Collection('Products')
export class ProductEntity extends ArangoDocument {
  @ApiProperty({ description: 'product pk', example: '1' })
  @IsString()
  @Length(1, 25)
  product_id: string;

  @ApiProperty({ description: 'نام محصول', example: 'موز' })
  @IsString()
  @Length(3, 20)
  product_name: string;

  @ApiProperty({
    description: 'ایدی تامین کننده محصول',
    example: 'Suppliers/92570',
  })
  @IsString()
  @Contains('Suppliers/')
  @Length(10, 25)
  supplier_id: string;

  @ApiProperty({
    description: 'مقدار باقی مانده محصول در انبار',
    example: 5,
  })
  @IsPositive()
  balance: number;

  @ApiProperty({
    description: 'مقیاس موجودی محصول',
    example: 'kg',
  })
  @IsEnum(scale)
  scale: string;

  @ApiProperty({
    description: 'آیدی دسته بندی',
    example: 'Categories/85640',
  })
  @IsString()
  @Length(12, 25)
  @Contains('Categories/')
  category_id: string;

  @ApiProperty({
    description: 'آیدی عکس محصول',
    example: '996de063-3f1b-4201-b9a1-2da6b32f09c5',
  })
  @IsOptional()
  @IsUUID()
  image_id: string;

  @ApiProperty({
    description: 'توضیحات محصول',
    example: 'موز به انبار اضافه شد',
  })
  @IsString()
  @IsOptional()
  @Length(0, 70)
  description: string;

  @ApiProperty({ description: 'قیمت', example: 1000 })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'تاریخ انقضا محصول',
    example: new Date('2024-12-31'),
  })
  @IsDateString()
  expiry_date?: Date;

  @ApiProperty({ description: 'برند محصول', example: 'چی توز' })
  @IsString()
  @Length(1, 30)
  brand: string;
}
