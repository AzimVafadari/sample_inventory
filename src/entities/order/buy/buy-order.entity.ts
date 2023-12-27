import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';
import { IsString } from 'class-validator';

@Collection('BuyOrders')
export class BuyOrderEntity extends ArangoDocument {
  @ApiProperty({
    description: 'ایدی محصول',
    example: '1',
  })
  @IsString()
  product_id?: string;

  @ApiProperty({
    description: 'ایدی تامین کننده',
    example: '1',
  })
  @IsString()
  supplier_id?: string;

  @ApiProperty({
    description: 'وضعیت سفارش',
    example: 'finished',
  })
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'مقدار خرید',
    example: '500 کیلوگرم',
  })
  @IsString()
  amount?: string;
}
