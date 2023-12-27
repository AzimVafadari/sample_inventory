import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';
import { IsString } from 'class-validator';

@Collection('Suppliers')
export class SupplierEntity extends ArangoDocument {
  @ApiProperty({
    description: 'نام تامین کننده',
    example: 'شرکت فولاد',
  })
  @IsString()
  supplier_name?: string;

  @ApiProperty({
    description: 'شماره همراه تامین کننده',
    example: '09132345632',
  })
  @IsString()
  supplier_telephone_number?: string;
}
