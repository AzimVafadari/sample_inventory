import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class BuyOrderFilter {
  constructor(object: BuyOrderFilter) {
    this.product_id = object.product_id;
    this.supplier_id = object.supplier_id;
    this.amount_from = object.amount_from;
    this.amount_to = object.amount_to;
    this.status = object.status;
    this.date_from = object.date_from;
    this.date_to = object.date_to;
  }

  @IsOptional()
  @IsString()
  product_id?: string;

  @IsOptional()
  @IsString()
  supplier_id?: string;

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
  @IsString()
  date_to?: Date;
}
