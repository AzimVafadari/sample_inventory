import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';
import { IsNumber, IsString } from 'class-validator';

@Collection('SaleOrders')
export class SaleOrderEntity extends ArangoDocument {
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
  customer_id?: string;

  @ApiProperty({
    description: 'وضعیت سفاارش',
    example: 'pending',
  })
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'مقدار خرید',
    example: 500,
  })
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: 'مقیاس خرید',
    example: 'کیلوگرم',
  })
  @IsString()
  scale?: string;
}
