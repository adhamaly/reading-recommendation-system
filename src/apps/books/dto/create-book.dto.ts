import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @ApiProperty({ type: String })
  name: string;

  @IsNumber()
  @ApiProperty({ type: Number })
  numOfPages: number;
}
