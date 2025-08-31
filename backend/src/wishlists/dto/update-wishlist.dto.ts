import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  items?: number[];
}
