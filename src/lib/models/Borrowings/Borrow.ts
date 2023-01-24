export class Borrow {
  bookId: string;
  userId: string;
  returnDate: Date;

  constructor(bookId: string, userId: string, returnDate: Date) {
    this.bookId = bookId;
    this.userId = userId;
    this.returnDate = returnDate;
  }
}
