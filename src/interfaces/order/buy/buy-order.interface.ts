export interface BuyOrderFilter {
  product_id: string;
  supplier_id: string;
  amount_from: number;
  amount_to: number;
  status: string;
  date_from?: Date;
  date_to?: Date;
}
