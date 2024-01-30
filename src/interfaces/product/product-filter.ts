import {
  Contains,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
enum scale {
  kg = 'kg',
  g = 'g',
  pieces = 'pieces',
  ton = 'ton',
}
export class ProductFilter {
  constructor(obj: ProductFilter) {
    this.product_name = obj.product_name;
    this.supplier_id = obj.supplier_id;
    this.balance_from = obj.balance_from;
    this.balance_to = obj.balance_to;
    this.scale = obj.scale;
    this.category_id = obj.category_id;
    this.price_from = obj.price_from;
    this.price_to = obj.price_to;
    this.expiry_date_from = obj.expiry_date_from;
    this.expiry_date_to = obj.expiry_date_to;
  }

  @IsOptional()
  @IsString()
  @Length(3, 20)
  product_name: string;

  @IsOptional()
  @IsString()
  @Length(10, 25)
  @Contains('Suppliers/')
  supplier_id: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  balance_from: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  balance_to: number;

  @IsOptional()
  @IsEnum(scale)
  scale: string;

  @IsOptional()
  @IsString()
  @Length(12, 25)
  @Contains('Categories/')
  category_id: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price_from: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price_to: number;

  @IsOptional()
  @IsDateString()
  expiry_date_from: Date;

  @IsOptional()
  @IsDateString()
  expiry_date_to: Date;
}
