// pagination.dto.ts (Updated to include brand sorting options)
import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value?.toString())
  @IsString()
  @IsIn(['createdAt', 'name', 'productCount'])
  sortBy?: 'createdAt' | 'name' | 'productCount' = 'createdAt';

  @IsOptional()
  @Transform(({ value }) => value?.toString())
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


// Add this interface for categories with product count
export interface CategoryWithProductCount {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parent?: any;
  parentId?: string;
  children?: any[];
  products?: any[];
  productCount: number;
}