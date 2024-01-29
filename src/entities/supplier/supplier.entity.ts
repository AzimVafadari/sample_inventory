import { ApiProperty } from '@nestjs/swagger';
import { ArangoDocument, Collection } from 'nest-arango';
import { IsNumberString, IsString, Length } from 'class-validator';

@Collection('Suppliers')
export class SupplierEntity extends ArangoDocument {
  @ApiProperty({
    description: 'نام تامین کننده',
    example: 'شرکت فولاد',
  })
  @IsString()
  @Length(1, 20)
  supplier_name: string;

  @ApiProperty({
    description: 'شماره همراه تامین کننده',
    example: '09132345632',
  })
  @IsNumberString()
  @Length(3, 25)
  supplier_telephone_number: string;
}
