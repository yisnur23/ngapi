import {Expose} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';
import {IconsEnum} from '../enums/icons.enum';

export class AppDto {
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
    description: 'Icon',
  })
  iconName?: IconsEnum;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Link',
  })
  link: string;
}
