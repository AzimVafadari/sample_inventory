import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaleOrderFilter {
  @IsOptional()
  @IsString()
  product_id?: string;

  @IsOptional()
  @IsString()
  customer_id: string;

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
