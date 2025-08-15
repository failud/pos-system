import { 
  IsString, 
  IsOptional, 
  IsEmail, 
  IsNumber, 
  IsDateString, 
  IsIn, 
  IsBoolean, 
  Min, 
  IsInt, 
  Max,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  customer_code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  first_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  last_name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { 
    message: 'Phone number must be a valid format' 
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be in ISO date format (YYYY-MM-DD)' })
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'other'], { 
    message: 'Gender must be one of: male, female, other' 
  })
  gender?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Loyalty points must be a number' })
  @Min(0, { message: 'Loyalty points cannot be negative' })
  loyalty_points?: number = 0;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total spent must be a number with maximum 2 decimal places' })
  @Min(0, { message: 'Total spent cannot be negative' })
  total_spent?: number = 0;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active?: boolean = true;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  customer_code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  first_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  last_name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { 
    message: 'Phone number must be a valid format' 
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be in ISO date format (YYYY-MM-DD)' })
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'other'], { 
    message: 'Gender must be one of: male, female, other' 
  })
  gender?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Loyalty points must be a number' })
  @Min(0, { message: 'Loyalty points cannot be negative' })
  loyalty_points?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total spent must be a number with maximum 2 decimal places' })
  @Min(0, { message: 'Total spent cannot be negative' })
  total_spent?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active?: boolean;
}

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Search term must not be empty' })
  @MaxLength(100, { message: 'Search term cannot exceed 100 characters' })
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value?.toString())
  @IsString()
  @IsIn(['createdAt', 'firstName', 'lastName', 'email', 'phone', 'customerCode', 'totalSpent', 'loyaltyPoints'], {
    message: 'sortBy must be one of: createdAt, firstName, lastName, email, phone, customerCode, totalSpent, loyaltyPoints'
  })
  sortBy?: 'createdAt' | 'firstName' | 'lastName' | 'email' | 'phone' | 'customerCode' | 'totalSpent' | 'loyaltyPoints' = 'createdAt';

  @IsOptional()
  @Transform(({ value }) => value?.toString().toUpperCase())
  @IsString()
  @IsIn(['ASC', 'DESC'], { message: 'sortOrder must be either ASC or DESC' })
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

// Extended pagination DTO with customer-specific filters
export class CustomerPaginationQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'other'], { 
    message: 'Gender must be one of: male, female, other' 
  })
  gender?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Minimum loyalty points must be an integer' })
  @Min(0, { message: 'Minimum loyalty points cannot be negative' })
  minLoyaltyPoints?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Maximum loyalty points must be an integer' })
  @Min(0, { message: 'Maximum loyalty points cannot be negative' })
  maxLoyaltyPoints?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Minimum total spent must be a number with maximum 2 decimal places' })
  @Min(0, { message: 'Minimum total spent cannot be negative' })
  minTotalSpent?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Maximum total spent must be a number with maximum 2 decimal places' })
  @Min(0, { message: 'Maximum total spent cannot be negative' })
  maxTotalSpent?: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { 
    message: 'dateFrom must be in YYYY-MM-DD format' 
  })
  dateFrom?: string; // YYYY-MM-DD format

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { 
    message: 'dateTo must be in YYYY-MM-DD format' 
  })
  dateTo?: string; // YYYY-MM-DD format
}