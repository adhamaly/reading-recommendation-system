import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from '../dto/create-book.dto';
import { PrismaService } from '../../../lib/prisma/prisma.service';
import { GetBooksDto } from '../dto/get-books.dto';
import { BookIdParamDto } from '../dto/book-id-param.dto';
import { UpdateBookDto } from '../dto/update-books.dto';
import { SubmitReadingInterval } from '../dto/submit-reading-interval.dto';

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

  async submitReadingIntervals(
    userId: number,
    { bookId, endPage, startPage }: SubmitReadingInterval,
  ) {
    const book = await this.prismaService.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (startPage > endPage) {
      throw new ConflictException('Start page cannot be greater than end page');
    }

    if (startPage >= book.numOfPages || endPage > book.numOfPages) {
      throw new ConflictException('Invalid reading interval range');
    }

    await this.prismaService.readingInterval.create({
      data: {
        userId: Number(userId),
        bookId,
        endPage,
        startPage,
      },
    });
  }

  async getTopReadBooks() {
    const rawResults = await this.prismaService.$queryRaw<
      { bookId: number; num_of_read_pages: number }[]
    >`
      WITH ReadingInterval AS (
        SELECT 
          "bookId",
          generate_series("startPage", "endPage") AS page
        FROM "ReadingInterval"
      )
      SELECT 
        "bookId",
        CAST(COUNT(DISTINCT page) AS INTEGER) AS num_of_read_pages
      FROM ReadingInterval
      GROUP BY "bookId"
      ORDER BY num_of_read_pages DESC
      LIMIT 5;
    `;

    const bookIds = rawResults.map((result) => result.bookId);

    const books = await this.prismaService.book.findMany({
      where: { id: { in: bookIds } },
      select: {
        id: true,
        name: true,
        numOfPages: true,
      },
    });

    // Map unique pages read to book
    const resultMap = rawResults.reduce((map, result) => {
      map[result.bookId] = result.num_of_read_pages;
      return map;
    }, {} as Record<number, number>);

    return books.map((book) => ({
      bookId: book.id,
      bookName: book.name,
      bookNumOfPages: book.numOfPages,
      numOfReadPages: resultMap[book.id],
    }));
  }
}
