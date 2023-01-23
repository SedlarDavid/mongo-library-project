export class Book {
  name: string;
  author: string;
  pagesCount: number;
  releaseYear: number;
  img: string;
  availableCount: number;
  borrowedCount: number;

  constructor(
    name: string,
    author: string,
    pagesCount: number,
    releaseYear: number,
    img: string,
    availableCount: number,
    borrowedCount: number
  ) {
    this.name = name;
    this.author = author;
    this.pagesCount = pagesCount;
    this.releaseYear = releaseYear;
    this.img = img;
    this.availableCount = availableCount;
    this.borrowedCount = borrowedCount;
  }
}
