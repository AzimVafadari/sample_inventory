import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Reports')
export class ReportEntity extends ArangoDocument {
  @ApiProperty({ description: 'شماره گزارش', example: '1' })
  report_id?: string;

  @ApiProperty({
    description: 'عنوان گزارش',
    example: 'این گزارش ... است',
  })
  title?: string;

  @ApiProperty({
    description: 'توضیحات گزارش',
    example: 'این گزارش ...',
  })
  content?: string[];

  @ApiProperty({
    description: 'تاریخ گزارش',
    example: new Date('2001-12-2'),
  })
  date?: Date;

  @ApiProperty({
    description: 'نوع گزارش',
    example: 'فروش',
  })
  type?: string;

  @ApiProperty({
    description: 'category description',
    example: '1',
  })
  product_id?: string;

  @ApiProperty({
    description: 'تعداد محصول',
    example: '100 عدد',
  })
  amount?: string;
}
