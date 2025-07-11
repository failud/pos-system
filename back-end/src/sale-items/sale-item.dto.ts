import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateSaleItemDto {
  @IsUUID()
  sale_id: string;

  @IsUUID()
  product_id: string;

  @IsOptional()
  @IsUUID()
  product_variant_id?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unit_price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_amount?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax_amount?: number = 0;

  @IsNumber()
  @Min(0)
  total_amount: number;
}

export class UpdateSaleItemDto {
  @IsOptional()
  @IsUUID()
  sale_id?: string;

  @IsOptional()
  @IsUUID()
  product_id?: string;

  @IsOptional()
  @IsUUID()
  product_variant_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unit_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount?: number;
}