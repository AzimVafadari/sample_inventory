import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';
import { IsDateString, IsNumber, IsString } from 'class-validator';

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
    description: 'مقدار فروش',
    example: 500,
  })
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: 'مقیاس فروش',
    example: 'کیلوگرم',
  })
  @IsString()
  scale?: string;

  @ApiProperty({
    description: 'تاریخ ایجاد سفارش فروش',
    example: new Date(),
  })
  @IsDateString()
  create_date?: Date;
}
