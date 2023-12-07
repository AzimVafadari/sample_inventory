import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Reports')
export class ReportEntityEntity extends ArangoDocument {
  @ApiProperty({ description: 'شماره گزارش', example: '1' })
  report_number?: string;
  @ApiProperty({
    description: 'عنوان گزارش',
    example: 'این گزارش ... است',
  })
  title?: string;
  @ApiProperty({
    description: 'توضیحات گزارش',
    example: 'این گزارش ...',
  })
  description?: string;
  @ApiProperty({
    description: 'تاریخ گزارش',
    example: '2023/04/15',
  })
  date?: Date;
  @ApiProperty({
    description: 'نوع گزارش',
    example: 'فروش',
  })
  type?: string;
  @ApiProperty({
    description: 'category description',
    example: 'این دسته بندی دارای میوه ها است',
  })
  product_id?: string;
  @ApiProperty({
    description: 'تعداد محصول',
    example: '100',
  })
  amount?: number;
}