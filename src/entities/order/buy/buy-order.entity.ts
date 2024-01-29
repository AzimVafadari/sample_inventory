import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';
import {
  Contains,
  IsDateString,
  IsEnum,
  IsNumber,
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

@Collection('BuyOrders')
export class BuyOrderEntity extends ArangoDocument {
  @ApiProperty({
    description: 'ایدی محصول',
    example: '1',
  })
  @IsString()
  @Length(1, 25)
  product_id: string;

  @ApiProperty({
    description: 'ایدی تامین کننده',
    example: '1',
  })
  @IsString()
  @Length(10, 25)
  @Contains('Suppliers/')
  supplier_id: string;

  @ApiProperty({
    description: 'وضعیت سفارش',
    example: 'pending',
  })
  @IsString()
  @IsEnum(status)
  status: string;

  @ApiProperty({
    description: 'مقدار خرید',
    example: 500,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
  @ApiProperty({
    description: 'مقیاس خرید',
    example: 'کیلوگرم',
  })
  @IsString()
  @IsEnum(scale)
  scale: string;
  @IsOptional()
  @IsDateString()
  create_date: Date;
}
