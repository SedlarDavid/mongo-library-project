export class Borrowing {
  bookId: string;
  userId: string;
  bookData: Date;

  constructor(bookId: string, userId: string, bookData: Date) {
    this.bookId = bookId;
    this.userId = userId;
    this.bookData = bookData;
  }
}
