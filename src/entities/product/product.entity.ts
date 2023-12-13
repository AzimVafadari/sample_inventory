import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Products')
export class ProductEntity extends ArangoDocument {
  @ApiProperty({ description: 'product pk', example: '1' })
  product_id?: string;

  @ApiProperty({ description: 'نام محصول', example: 'موز' })
  product_name?: string;

  @ApiProperty({ description: 'ایدی تامین کننده محصول', example: 2 })
  supplier_id?: number;

  @ApiProperty({
    description: 'مقدار باقی مانده محصول در انبار',
    example: '5 کیلوگرم',
  })
  balance?: string;

  @ApiProperty({
    description: 'آیدی دسته بندی ',
    example: '5',
  })
  category_id?: string;

  image_id?: number;

  @ApiProperty({
    description: 'توضیحات محصول',
    example: 'موز به انبار اضافه شد',
  })
  description?: string;

  @ApiProperty({ description: 'قیمت', example: 1000 })
  price?: number;

  @ApiProperty({
    description: 'تاریخ انقضا محصول',
    example: new Date('2023-12-31'),
  })
  expiry_date?: Date;

  @ApiProperty({ description: 'برند محصول', example: 'چی توز' })
  brand?: string;
}
