import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Collection('Customers')
export class CustomerEntity extends ArangoDocument {
  @ApiProperty({
    description: 'نام مشتری',
    example: 'علی حسینی',
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'آدرس',
    example: 'یزد میدان امام علی',
  })
  @IsString()
  address?: string;
}
