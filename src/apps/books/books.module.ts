import { Module } from '@nestjs/common';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';

@Module({
  imports: [],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
