import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

@Collection('Customers')
export class CustomerEntity extends ArangoDocument {
  @ApiProperty({
    description: 'نام مشتری',
    example: 'علی حسینی',
  })
  @IsString()
  @Length(5, 20)
  name: string;

  @ApiProperty({
    description: 'آدرس',
    example: 'یزد میدان امام علی',
  })
  @IsString()
  @Length(10, 70)
  address: string;
}
