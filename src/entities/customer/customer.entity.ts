import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Customers')
export class CustomerEntity extends ArangoDocument {
  @ApiProperty({
    description: 'آیدی مشتری',
    example: '1',
  })
  customer_id?: string;

  @ApiProperty({
    description: 'نام مشتری',
    example: 'علی حسینی',
  })
  name?: string;

  @ApiProperty({
    description: 'آدرس',
    example: 'یزد میدان امام علی',
  })
  address?: string;
}
