import { IsEmail, IsOptional, IsString, IsInt, MaxLength, IsBoolean, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MaxLength(100)
    firstname: string;

    @IsString()
    @MaxLength(100)
    lastname: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    company?: string;

    @IsEmail()
    @MaxLength(100)
    email: string;

    // API-facing username (for compatibility with frontend)
    @IsString()
    @MaxLength(100)
    username: string;

    // API-facing password (for compatibility with frontend)
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsInt()
    warehouseID?: number;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}

export class UpdateUserDto extends CreateUserDto { }
