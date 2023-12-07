import {Expose, Transform} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class TabDto {
  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Label',
  })
  label: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Slug',
  })
  slug: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Model',
  })
  @Transform(({ obj }) => {
    return obj.getModelSlug();
  })
  model: string;

  @Expose()
  @IsString()
  @Transform(({ obj }) => {
    return obj.getUrl();
  })
  url: string;
}
