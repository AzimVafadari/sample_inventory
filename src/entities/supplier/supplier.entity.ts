import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';

@Collection('suppliers')
export class SupplierEntity extends ArangoDocument {
  @ApiProperty({
    description: 'ایدی تامین کننده',
    example: '1',
  })
  supplier_id?: string;

  @ApiProperty({
    description: 'نام تامین کننده',
    example: 'شرکت فولاد',
  })
  supplier_name?: string;

  @ApiProperty({
    description: 'شماره همراه تامین کننده',
    example: '09132345632',
  })
  supplier_telephone_number?: string;
}
