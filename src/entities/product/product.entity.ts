import { Collection, ArangoDocument, BeforeSave } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Products')
export class ProductEntity extends ArangoDocument {
  @ApiProperty({ description: 'نام محصول', example: 'موز' })
  product_name?: string;

  @ApiProperty({
    description: 'توضیحات محصول',
    example: 'موز به انبار اضافه شد',
  })
  description?: string;

  @ApiProperty({ description: 'قیمت', example: '1000' })
  price?: number;

  image_id?: number;

  @ApiProperty({
    description: 'آیدی دسته بندی ',
    example: '[1, 2, 3]',
  })
  category_id?: string[];

  @ApiProperty({ description: 'موجودی اولیه', example: '20' })
  initial_balance?: number;
  @ApiProperty({ description: 'موجودی فعلی', example: '10' })
  current_balance?: number;
  created_at?: Date;
  updated_at?: Date;
  @ApiProperty({ description: 'تاریخ انقضا محصول', example: '2024/12/03' })
  expiry_date?: Date;
  @ApiProperty({
    description: 'نظرات',
    example: '["این محصول برای فصل زمستان هست"]',
  })
  comments?: string[];
  @ApiProperty({ description: 'کد محصول', example: 'GFD58LIBGDX2DS5V' })
  product_code?: string;
  @ApiProperty({ description: 'محصولات مرتبط', example: '[پرتقال ,ماهی]' })
  related_products?: string[];
  @ApiProperty({ description: 'برند محصول', example: 'چی توز' })
  brand?: string;
  @ApiProperty({ description: 'محصولات جایگزین', example: '[انار ,سیب]' })
  alternative_products?: string[];

  @BeforeSave()
  beforeSave() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
