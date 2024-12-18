import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../../../lib/prisma/prisma.service';

describe('BooksService', () => {
  let booksService: BooksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
            book: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    booksService = module.get<BooksService>(BooksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getTopReadBooks', () => {
    it('should return the top read books with the correct number of unique read pages', async () => {
      // Mock raw SQL query result
      const rawResults = [
        { bookId: 1, num_of_read_pages: 120 },
        { bookId: 2, num_of_read_pages: 90 },
      ];
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue(rawResults);

      // Mock findMany to fetch book details
      const mockBooks = [
        { id: 1, name: 'Book One', numOfPages: 300 },
        { id: 2, name: 'Book Two', numOfPages: 200 },
      ];
      jest.spyOn(prismaService.book, 'findMany').mockResolvedValue(mockBooks);

      // Call the service function
      const result = await booksService.getTopReadBooks();

      // Assert the expected output
      expect(result).toEqual([
        {
          bookId: 1,
          bookName: 'Book One',
          bookNumOfPages: 300,
          numOfReadPages: 120,
        },
        {
          bookId: 2,
          bookName: 'Book Two',
          bookNumOfPages: 200,
          numOfReadPages: 90,
        },
      ]);

      // Verify the raw SQL query and findMany were called
      expect(prismaService.$queryRaw).toHaveBeenCalledTimes(1);
      expect(prismaService.book.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] } },
        select: {
          id: true,
          name: true,
          numOfPages: true,
        },
      });
    });

    it('should return an empty array if there are no results', async () => {
      // Mock raw SQL query result with no results
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue([]);

      // Mock findMany to return no books
      jest.spyOn(prismaService.book, 'findMany').mockResolvedValue([]);

      // Call the service function
      const result = await booksService.getTopReadBooks();

      // Assert the result is an empty array
      expect(result).toEqual([]);

      // Verify the raw SQL query and findMany were called
      expect(prismaService.$queryRaw).toHaveBeenCalledTimes(1);
      expect(prismaService.book.findMany).toHaveBeenCalledWith({
        where: { id: { in: [] } },
        select: {
          id: true,
          name: true,
          numOfPages: true,
        },
      });
    });
  });
});
