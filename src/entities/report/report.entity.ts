import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsString } from 'class-validator';

@Collection('Reports')
export class ReportEntity extends ArangoDocument {
  @ApiProperty({
    description: 'عنوان گزارش',
    example: 'این گزارش ... است',
  })
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'توضیحات گزارش',
    example: 'این گزارش ...',
  })
  @IsArray()
  content?: string[];

  @ApiProperty({
    description: 'تاریخ گزارش',
    example: new Date('2001-12-2'),
  })
  @IsDateString()
  date?: Date;
}
