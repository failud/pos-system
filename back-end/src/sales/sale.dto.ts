import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID, IsArray, ValidateNested, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount?: number;
}

export class CreateSaleDto {
  @IsNotEmpty()
  @IsString()
  saleNumber: string;

  @IsOptional()
  @IsUUID()
  storeId?: string;

  @IsOptional()
  @IsUUID()
  cashierId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'partial', 'refunded'])
  paymentStatus?: 'pending' | 'paid' | 'partial' | 'refunded';

  @IsOptional()
  @IsEnum(['cash', 'card', 'transfer', 'mixed'])
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'mixed';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}

export class UpdateSaleDto {
  @IsOptional()
  @IsEnum(['pending', 'paid', 'partial', 'refunded'])
  paymentStatus?: 'pending' | 'paid' | 'partial' | 'refunded';

  @IsOptional()
  @IsEnum(['completed', 'cancelled', 'returned'])
  saleStatus?: 'completed' | 'cancelled' | 'returned';

  @IsOptional()
  @IsEnum(['cash', 'card', 'transfer', 'mixed'])
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'mixed';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SaleResponseDto {
  id: string;
  saleNumber: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: string;
  saleStatus: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: SaleItemResponseDto[];
}

export class SaleItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  product: {
    id: string;
    name: string;
    sku: string;
    taxRate: number;
  };
}