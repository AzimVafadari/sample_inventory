import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@Collection('Reports')
export class ReportEntity extends ArangoDocument {
  @ApiProperty({
    description: 'عنوان گزارش',
    example: 'این گزارش ... است',
  })
  @IsString()
  @Length(0, 20)
  title: string;

  @ApiProperty({
    description: 'محتوای گزارش',
    example: [''],
  })
  @IsArray()
  @ArrayMaxSize(10)
  content: string[];

  @IsOptional()
  @IsDateString()
  date: Date;
}
