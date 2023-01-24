export class Borrow {
  bookId: string;
  userId: string;
  borrowDate: Date;

  constructor(bookId: string, userId: string, borrowDate: Date) {
    this.bookId = bookId;
    this.userId = userId;
    this.borrowDate = borrowDate;
  }
}
