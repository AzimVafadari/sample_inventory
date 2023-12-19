import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';

@Collection('buy_orders')
export class BuyOrderEntity extends ArangoDocument {
  @ApiProperty({
    description: 'ایدی سفارش',
    example: '1',
  })
  buy_order_id?: string;

  @ApiProperty({
    description: 'ایدی محصول',
    example: '1',
  })
  product_id?: string;

  @ApiProperty({
    description: 'ایدی تامین کننده',
    example: '1',
  })
  supplier_id?: string;

  @ApiProperty({
    description: 'وضعیت سفارش',
    example: 'finished',
  })
  status?: string;

  @ApiProperty({
    description: 'مقدار خرید',
    example: '500 کیلوگرم',
  })
  amount?: string;
}
