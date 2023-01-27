import * as Realm from "realm-web";
import { Constants, MongoCollections } from "../../Constants";
import { realmApp } from "../../main";
import { Book, type IBook } from "../models/Books/Book";
import { Borrow } from "../models/Borrowings/Borrow";
import { Return } from "../models/Borrowings/Return";

const {
  BSON: { ObjectId },
} = Realm;

export class BooksRepository {
  static async importBookData(bookData: object) {
    let mongo = realmApp.currentUser
      .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
      .db(Constants.DatabaseName);
    await mongo.collection(MongoCollections.Books).insertOne(bookData);
  }

  static async returnBook(id: string, data: IBook): Promise<void> {
    let mongo = realmApp.currentUser
      .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
      .db(Constants.DatabaseName);
    data.availableCount++;
    data.borrowedCount--;
    await mongo
      .collection(MongoCollections.Books)
      .updateOne({ _id: id }, { $set: Book.fromFormData(data) });

    await mongo.collection(MongoCollections.Borrowings).deleteOne({
      bookId: new ObjectId(id),
      userId: realmApp.currentUser.id,
    });
    await mongo
      .collection(MongoCollections.BorrowHistory)
      .insertOne(new Return(id, realmApp.currentUser.id, new Date()));
  }
  static async deleteBook(id: string): Promise<void> {
    let mongo = realmApp.currentUser
      .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
      .db(Constants.DatabaseName);
    await mongo.collection(MongoCollections.Books).deleteOne({
      _id: new ObjectId(id.toString()),
    });
  }

  static async borrowBook(id: string, data: IBook): Promise<void> {
    let mongo = realmApp.currentUser
      .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
      .db(Constants.DatabaseName);
    data.availableCount--;
    data.borrowedCount++;
    await mongo
      .collection(MongoCollections.Books)
      .updateOne({ _id: id }, { $set: Book.fromFormData(data) });

    await mongo
      .collection(MongoCollections.Borrowings)
      .insertOne(new Borrow(id, realmApp.currentUser.id, new Date()));
  }

  static async borrowBookToUser(book: Book, userId: string): Promise<void> {
    let mongo = realmApp.currentUser
      .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
      .db(Constants.DatabaseName);
    book.availableCount--;
    book.borrowedCount++;
    await mongo
      .collection(MongoCollections.Books)
      .updateOne(
        { _id: new ObjectId(book._id.toString()) },
        { $set: Book.fromFormData(book) }
      );
    await mongo
      .collection(MongoCollections.Borrowings)
      .insertOne(new Borrow(book._id.toString(), userId, new Date()));
  }

  static async saveBookChanges(id: string, data: IBook): Promise<void> {
    let mongo = realmApp.currentUser
      .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
      .db(Constants.DatabaseName);
    await mongo
      .collection(MongoCollections.Books)
      .updateOne({ _id: id }, { $set: Book.fromFormData(data) });
  }

  static async addBook(book: Book): Promise<number> {
    let mongo = realmApp.currentUser
      .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
      .db(Constants.DatabaseName);
    var result = await mongo
      .collection(MongoCollections.Books)
      .insertOne(book.withRemovedId());
    return result.insertedId;
  }
}
