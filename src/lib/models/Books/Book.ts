import { writable } from "svelte/store";

export interface IBook {
  _id: string;
  name: string;
  author: string;
  pagesCount: number;
  releaseYear: number;
  img: string;
  availableCount: number;
  borrowedCount: number;
}

import { writable } from "svelte/store";

export interface IBook {
  _id: string;
  name: string;
  author: string;
  pagesCount: number;
  releaseYear: number;
  img: string;
  availableCount: number;
  borrowedCount: number;
}

export class Book {
  _id: string;
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
    _id: string,
    name: string,
    author: string,
    pagesCount: number,
    releaseYear: number,
    img: string,
    availableCount: number,
    //TODO from sum ATLAS function
    //TODO from sum ATLAS function
    borrowedCount: number
  ) {
    this._id = _id;
    this._id = _id;
    this.name = name;
    this.author = author;
    this.pagesCount = pagesCount;
    this.releaseYear = releaseYear;
    this.img = img;
    this.availableCount = availableCount;
    this.borrowedCount = borrowedCount;
  }

  static fromFormData(formData: IBook): Book {
    return new Book(
      formData._id,
      formData.name,
      formData.author,
      formData.pagesCount,
      formData.releaseYear,
      formData.img,
      formData.availableCount,
      formData.borrowedCount
    );
  }

  withRemovedId() {
    return {
      name: this.name,
      author: this.author,
      pagesCount: this.pagesCount,
      releaseYear: this.releaseYear,
      img: this.img,
      availableCount: this.availableCount,
      borrowedCount: this.borrowedCount,
    };
  }
}
