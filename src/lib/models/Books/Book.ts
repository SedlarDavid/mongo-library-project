export class Book {
  _id: string;
  name: string;
  author: string;
  pagesCount: number;
  releaseYear: number;
  img: string;
  availableCount: number;
  borrowedCount: number;

  constructor(
    _id: string,
    name: string,
    author: string,
    pagesCount: number,
    releaseYear: number,
    img: string,
    availableCount: number,
    borrowedCount: number
  ) {
    this._id = _id;
    this.name = name;
    this.author = author;
    this.pagesCount = pagesCount;
    this.releaseYear = releaseYear;
    this.img = img;
    this.availableCount = availableCount;
    this.borrowedCount = borrowedCount;
  }
}
