import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';

@Collection('sale_orders')
export class Sale_orderEntity extends ArangoDocument {
  @ApiProperty({
    description: 'ایدی محصولات',
    example: ['1', '2'],
  })
  products?: string[];

  @ApiProperty({
    description: 'ایدی تامین کننده',
    example: '1',
  })
  customer_id?: string;

  @ApiProperty({
    description: 'وضعیت سفاارش',
    example: 'finished',
  })
  status?: string;

  @ApiProperty({
    description: 'مقدار خرید',
    example: '500 کیلو گرم',
  })
  amount?: string;
}
