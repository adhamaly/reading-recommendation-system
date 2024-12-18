import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class SubmitReadingInterval {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsInt({ message: 'limit must be an integer' })
  @ApiProperty({ type: Number })
  bookId: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsInt({ message: 'limit must be an integer' })
  @ApiProperty({ type: Number })
  startPage: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsInt({ message: 'limit must be an integer' })
  @ApiProperty({ type: Number })
  endPage: number;
}
