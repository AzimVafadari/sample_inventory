import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class BuyOrderFilter {
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
