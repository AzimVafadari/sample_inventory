import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaleOrderFilter {
  @IsOptional()
  @IsString()
  product_id?: string;

  @IsOptional()
  @IsString()
  customer_id: string;

  constructor(object: SaleOrderFilter) {
    this.product_id = object.product_id;
    this.customer_id = object.customer_id;
    this.amount_from = object.amount_from;
    this.amount_to = object.amount_to;
    this.status = object.status;
    this.date_from = object.date_from;
    this.date_to = object.date_to;
  }

  @IsOptional()
  @IsNumber()
  amount_from?: number;

  @IsOptional()
  @IsNumber()
  amount_to?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  date_from?: Date;

  @IsOptional()
  @IsDateString()
  date_to?: Date;
}
