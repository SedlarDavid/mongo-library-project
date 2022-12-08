import { writable } from "svelte/store";
import { AccountRole } from "../enums/AccountRole";
import { AccountState } from "../enums/AccountState";

interface IRegisterUserFormData {
  name: string;
  surname: string;
  personalId: string;
  address: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerUserFormData = writable({
  name: "",
  surname: "",
  personalId: "",
  address: "",
  email: "",
  password: "",
  passwordConfirm: "",
});

export class UserData {
  name: string;
  surname: string;
  personalId: string;
  address: string;
  email: string;
  nickname: string;
  accountState: AccountState;
  borrowedBooks: Array<string>;
  role: AccountRole;

  constructor(
    name: string,
    surname: string,
    personalId: string,
    address: string,
    email: string,
    nickname: string,
    accountState: AccountState,
    borrowedBooks: Array<string>,
    role: AccountRole
  ) {
    this.name = name;
    this.surname = surname;
    this.personalId = personalId;
    this.address = address;
    this.email = email;
    this.nickname = nickname;
    this.accountState = accountState;
    this.borrowedBooks = borrowedBooks;
    this.role = role;
  }

  static fromFormData(formData: IRegisterUserFormData): UserData {
    return new UserData(
      formData.name,
      formData.surname,
      formData.personalId,
      formData.address,
      formData.email,
      formData.email.split("@")[0],
      AccountState.Inactive,
      new Array<string>(),
      AccountRole.User
    );
  }
}
