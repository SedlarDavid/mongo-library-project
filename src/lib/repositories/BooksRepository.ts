import * as Realm from "realm-web";
import { Constants, MongoCollections } from "../../Constants";
import { mongo, realmApp } from "../../main";
import { Book, type IBook } from "../models/Books/Book";
import { Borrow } from "../models/Borrowings/Borrow";
import { Return } from "../models/Borrowings/Return";

const {
  BSON: { ObjectId },
} = Realm;

export class BooksRepository {
  static returnBook(id: string, data: IBook): void {
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

  static borrowBook(id: string, data: IBook): void {
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
    mongo
      .collection(MongoCollections.Books)
      .updateOne({ _id: id }, { $set: Book.fromFormData(data) });
  }
}
