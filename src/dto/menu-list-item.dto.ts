import {Expose, Transform} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';
import {IconsEnum} from '../enums/icons.enum';

export class MenuListItemDto {
  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Label',
  })
  @Transform(({ obj }) => {
    return obj.getLabel();
  })
  label: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Icon',
  })
  @Transform(({ obj }) => {
    return obj.getIcon();
  })
  iconName: IconsEnum;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Link',
  })
  @Transform(({ obj }) => {
    return obj.getUrl();
  })
  url: string;
}
