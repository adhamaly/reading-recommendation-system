import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BooksService } from '../services/books.service';
import { JwtVerifyGuard } from '../../auth/gurads/jwt-verify.guard';
import { IsAdminGuard } from '../../auth/gurads/isAdmin.guard';
import { Persona } from '../../../lib/decorators/params';
import { CreateBookDto } from '../dto/create-book.dto';
import { GetBooksDto } from '../dto/get-books.dto';
import { BookIdParamDto } from '../dto/book-id-param.dto';
import { UpdateBookDto } from '../dto/update-books.dto';
import { SubmitReadingInterval } from '../dto/submit-reading-interval.dto';
import { UserJwtPersona } from '../../../lib/interfaces/jwt-persona';

@Controller('books')
@ApiBearerAuth()
@ApiTags('Books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  @UseGuards(JwtVerifyGuard, IsAdminGuard)
  async createBook(
    @Persona() userJwtPersona: UserJwtPersona,
    @Body() createBookDto: CreateBookDto,
  ) {
    await this.booksService.createBook(createBookDto);
    return {
      success: true,
    };
  }

  @Get()
  @UseGuards(JwtVerifyGuard, IsAdminGuard)
  async getBooks(
    @Persona() userJwtPersona: UserJwtPersona,
    @Query() getBooksDto: GetBooksDto,
  ) {
    const result = await this.booksService.getBooks(getBooksDto);
    return {
      success: true,
      data: result,
    };
  }

  @Post('reading-intervals')
  @UseGuards(JwtVerifyGuard)
  async submitReadingIntervals(
    @Persona() userJwtPersona: UserJwtPersona,
    @Body() submitReadingInterval: SubmitReadingInterval,
  ) {
    await this.booksService.submitReadingIntervals(
      userJwtPersona.id,
      submitReadingInterval,
    );
    return {
      success: true,
    };
  }

  @Get('top')
  @UseGuards(JwtVerifyGuard)
  async getTopReadBooks() {
    return {
      success: true,
      data: await this.booksService.getTopReadBooks(),
    };
  }

  @Get(':bookId')
  @UseGuards(JwtVerifyGuard, IsAdminGuard)
  async getBookDetails(
    @Persona() userJwtPersona: UserJwtPersona,
    @Param() bookIdParamDto: BookIdParamDto,
  ) {
    return {
      success: true,
      data: await this.booksService.getBookDetails(bookIdParamDto),
    };
  }

  @Patch(':bookId')
  @UseGuards(JwtVerifyGuard, IsAdminGuard)
  async updateBook(
    @Persona() userJwtPersona: UserJwtPersona,
    @Param() bookIdParamDto: BookIdParamDto,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    await this.booksService.updateBookDetails(bookIdParamDto, updateBookDto);
    return {
      success: true,
    };
  }

  @Delete(':bookId')
  @UseGuards(JwtVerifyGuard, IsAdminGuard)
  async deleteBook(
    @Persona() userJwtPersona: UserJwtPersona,
    @Param() bookIdParamDto: BookIdParamDto,
  ) {
    await this.booksService.deleteBook(bookIdParamDto);
    return {
      success: true,
    };
  }
}
