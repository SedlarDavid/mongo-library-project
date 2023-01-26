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


  static returnBook(id: string, data: IBook): void {
   let mongo = realmApp.currentUser
    .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
    .db(Constants.DatabaseName);
    data.availableCount++;
    data.borrowedCount--;
    mongo
      .collection(MongoCollections.Books)
      .updateOne({ _id: id }, { $set: Book.fromFormData(data) });
    //TODO via Trigger
    mongo.collection(MongoCollections.Borrowings).deleteOne({
      bookId: new ObjectId(id),
      userId: realmApp.currentUser.id,
    });
    mongo
      .collection(MongoCollections.BorrowHistory)
      .insertOne(new Return(id, realmApp.currentUser.id, new Date()));
  }
  static deleteBook(id: string): void {
    let mongo = realmApp.currentUser
    .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
    .db(Constants.DatabaseName);
    mongo.collection(MongoCollections.Books).deleteOne({
      _id: new ObjectId(id.toString()),
    });

    //TODO update borrowings / returns via trigger
  }

  static borrowBook(id: string, data: IBook): void {
    let mongo = realmApp.currentUser
    .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
    .db(Constants.DatabaseName);
    data.availableCount--;
    data.borrowedCount++;
    mongo
      .collection(MongoCollections.Books)
      .updateOne({ _id: id }, { $set: Book.fromFormData(data) });
    //TODO via Trigger
    mongo
      .collection(MongoCollections.Borrowings)
      .insertOne(new Borrow(id, realmApp.currentUser.id, new Date()));
  }

  static saveBookChanges(id: string, data: IBook): void {
    let mongo = realmApp.currentUser
    .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
    .db(Constants.DatabaseName);
    mongo
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
