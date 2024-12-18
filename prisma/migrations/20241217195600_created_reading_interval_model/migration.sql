-- CreateTable
CREATE TABLE "ReadingInterval" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "startPage" INTEGER NOT NULL,
    "endPage" INTEGER NOT NULL,

    CONSTRAINT "ReadingInterval_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReadingInterval" ADD CONSTRAINT "ReadingInterval_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingInterval" ADD CONSTRAINT "ReadingInterval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
