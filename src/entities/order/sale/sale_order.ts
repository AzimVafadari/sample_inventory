import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';

@Collection('sale_orders')
export class Sale_orderEntity extends ArangoDocument {
  @ApiProperty({
    description: 'ایدی سفارش',
    example: '1',
  })
  sale_order_id?: string;
  @ApiProperty({
    description: 'ایدی محصول',
    example: '1',
  })
  product_id?: string;

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

  @ApiProperty({
    description: 'مسیر تا رسیدن به ریشه',
    example: '1.2.4',
  })
  path_to_root?: string;
}
