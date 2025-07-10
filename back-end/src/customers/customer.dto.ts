import { IsString, IsOptional, IsEmail, IsNumber, IsDateString, IsIn, IsBoolean, Min } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  customer_code?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  loyalty_points?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_spent?: number = 0;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  customer_code?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  loyalty_points?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_spent?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}