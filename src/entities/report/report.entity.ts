import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsString } from 'class-validator';

@Collection('Reports')
export class ReportEntity extends ArangoDocument {
  @ApiProperty({ description: 'شماره گزارش', example: '1' })
  @IsString()
  report_id?: string;

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
  @IsDate()
  date?: Date;
}
