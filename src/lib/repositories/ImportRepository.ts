import * as Realm from "realm-web";

const {
  BSON: { ObjectId },
} = Realm;

export enum ImportType {
  Books,
  Users,
}

export class ImportRepository {
  static async importData(file) {
    const reader = new FileReader();
    let data = reader.readAsText(file);
    console.log(data);
  }
}
