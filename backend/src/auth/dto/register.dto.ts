import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../generated/prisma/client.js'; 

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either USER or INSTRUCTOR' })
  role?: Role;
}