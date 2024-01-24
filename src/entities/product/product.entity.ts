import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';

@Collection('Products')
export class ProductEntity extends ArangoDocument {
  @ApiProperty({ description: 'product pk', example: '1' })
  @IsString()
  product_id?: string;

  @ApiProperty({ description: 'نام محصول', example: 'موز' })
  @IsString()
  product_name?: string;

  @ApiProperty({ description: 'ایدی تامین کننده محصول', example: '2' })
  @IsString()
  supplier_id?: string;

  @ApiProperty({
    description: 'مقدار باقی مانده محصول در انبار',
    example: 5,
  })
  @IsNumber()
  balance?: number;

  @ApiProperty({
    description: 'مقیاس موجودی محصول',
    example: 'کیلوگرم',
  })
  @IsString()
  scale?: string;

  @ApiProperty({
    description: 'آیدی دسته بندی',
    example: '1',
  })
  @IsString()
  category_id?: string;

  image_id?: number;

  @ApiProperty({
    description: 'توضیحات محصول',
    example: 'موز به انبار اضافه شد',
  })
  @IsString()
  description?: string;

  @ApiProperty({ description: 'قیمت', example: 1000 })
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'تاریخ انقضا محصول',
    example: new Date('2023-12-31'),
  })
  @IsDate()
  expiry_date?: Date;

  @ApiProperty({ description: 'برند محصول', example: 'چی توز' })
  @IsString()
  brand?: string;
}
