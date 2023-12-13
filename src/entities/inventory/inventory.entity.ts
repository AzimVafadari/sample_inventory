import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Inventories')
export class InventoryEntity extends ArangoDocument {
  @ApiProperty({
    description: 'آیدی مشتری',
    example: '1',
  })
  inventory_id?: string;
  @ApiProperty({
    description: 'نام مشتری',
    example: 'علی حسینی',
  })
  name?: string;
  @ApiProperty({
    description: 'فعال بودن انبار',
    example: true,
  })
  is_enable?: boolean;
  @ApiProperty({
    description: 'لیست آیدی محصولات',
    example: ['15', '12'],
  })
  products_id?: string[];
  @ApiProperty({
    description: 'شماره تلفن انبار',
    example: '0351261533',
  })
  telephone_number?: string;
}
