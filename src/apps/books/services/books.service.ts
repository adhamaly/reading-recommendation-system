import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from '../dto/create-book.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { GetBooksDto } from '../dto/get-books.dto';
import { BookIdParamDto } from '../dto/book-id-param.dto';
import { UpdateBookDto } from '../dto/update-books.dto';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  async createBook({ name, numOfPages }: CreateBookDto) {
    await this.prismaService.book.create({
      data: {
        name,
        numOfPages: Number(numOfPages),
      },
    });
  }

  async getBooks(getBooksDto: GetBooksDto) {
    const { page = 1, limit = 10 } = getBooksDto;
    const skip = (page - 1) * limit;

    const books = await this.prismaService.book.findMany({
      skip: skip,
      take: Number(limit),
    });
    const booksCount = await this.prismaService.book.count({});

    return {
      books,
      totalPages: Math.ceil(booksCount / limit) || 0,
      totalItems: booksCount,
      page: Number(page),
      limit: Number(limit),
    };
  }
  async getBookDetails({ bookId }: BookIdParamDto) {
    const book = await this.prismaService.book.findUnique({
      where: {
        id: Number(bookId),
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }
  async updateBookDetails(
    { bookId }: BookIdParamDto,
    updateBookDto: UpdateBookDto,
  ) {
    const book = await this.prismaService.book.findUnique({
      where: {
        id: Number(bookId),
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.prismaService.book.update({
      where: {
        id: Number(bookId),
      },
      data: {
        ...updateBookDto,
      },
    });
  }
  async deleteBook({ bookId }: BookIdParamDto) {
    const book = await this.prismaService.book.findUnique({
      where: {
        id: Number(bookId),
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.prismaService.book.delete({
      where: {
        id: Number(bookId),
      },
    });
  }
}
