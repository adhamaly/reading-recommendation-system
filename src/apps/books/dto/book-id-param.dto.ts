import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BookIdParamDto {
  @IsNumber()
  @ApiProperty({ type: Number })
  bookId: number;
}
