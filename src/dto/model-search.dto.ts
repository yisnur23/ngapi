import {Expose, Transform} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsInt, IsObject, IsOptional, IsString,} from 'class-validator';

export class ModelSearchDto {
  @Expose()
  @IsOptional()
  @IsInt()
  @ApiProperty({
    description: 'Limit',
  })
  limit?: number;

  @Expose()
  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'Attributes to select',
  })
  select?: Array<string>;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Apply Model Filter',
  })
  filter?: string;

  @Expose()
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty({
    description: 'Apply Filters',
  })
  userFilters?: object;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Search phrase',
  })
  search?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiProperty({
    description: 'Page number',
  })
  page?: number;

  @Expose()
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => value && JSON.parse(value))
  @ApiProperty({
    description: 'Sort object',
  })
  sort?: object;
}
