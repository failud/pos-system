import { IsString, IsEmail, IsOptional, IsIn, IsBoolean, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['admin', 'manager', 'cashier'])
  role?: string = 'cashier';

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['admin', 'manager', 'cashier'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  password_hash?: string;
}

export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}