import {AppDto} from '../app.dto';
import {ApiProperty} from '@nestjs/swagger';

export class AppsResultDto {
  @ApiProperty()
  apps: Array<AppDto>;
}
