import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Products')
export class ProductEntity extends ArangoDocument {
  @ApiProperty({ description: 'product pk', example: '1' })
  product_id?: number;

  @ApiProperty({ description: 'نام محصول', example: 'موز' })
  product_name?: string;

  @ApiProperty({ description: 'ایدی تامین کننده محصول', example: '2' })
  supplier_id?: number;

  @ApiProperty({
    description: 'مقدار باقی مانده محصول در انبار',
    example: '5 کیلو گرم',
  })
  balance?: string;

  @ApiProperty({
    description: 'آیدی دسته بندی ',
    example: '[1, 2, 3]',
  })
  category_id?: string;

  image_id?: number;

  @ApiProperty({
    description: 'توضیحات محصول',
    example: 'موز به انبار اضافه شد',
  })
  description?: string;

  @ApiProperty({ description: 'قیمت', example: '1000' })
  price?: number;

  @ApiProperty({ description: 'تاریخ انقضا محصول', example: '2024/12/03' })
  expiry_date?: Date;

  @ApiProperty({ description: 'برند محصول', example: 'چی توز' })
  brand?: string;
}
