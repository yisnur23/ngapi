import {Expose} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class ModelDto {
  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Slug',
  })
  slug: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Label',
  })
  label: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Plural',
  })
  plural: string;
}
