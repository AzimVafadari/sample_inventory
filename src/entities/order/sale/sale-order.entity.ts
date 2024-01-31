import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';
import {
  Contains,
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
enum status {
  pending = 'pending',
  finished = 'finished',
  canceled = 'canceled',
}

enum scale {
  kg = 'kg',
  g = 'g',
  pieces = 'pieces',
  ton = 'ton',
}
@Collection('SaleOrders')
export class SaleOrderEntity extends ArangoDocument {
  @ApiProperty({
    description: 'ایدی محصول',
    example: '1',
  })
  @IsString()
  @Length(1, 25)
  product_id: string;

  @ApiProperty({
    description: 'ایدی مصرف کننده',
    example: 'Customers/34750',
  })
  @IsString()
  @Length(10, 25)
  @Contains('Customers/')
  customer_id: string;

  @ApiProperty({
    description: 'وضعیت سفاارش',
    example: 'pending',
  })
  @IsEnum(status)
  status: string;

  @ApiProperty({
    description: 'مقدار فروش',
    example: 500,
  })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'مقیاس فروش',
    example: 'kg',
  })
  @IsEnum(scale)
  scale: string;

  @IsOptional()
  @IsDateString()
  create_date: Date;
}
