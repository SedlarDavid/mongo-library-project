<script lang="ts">
  import {
    Avatar,
    Button,
    ButtonGroup,
    Input,
    Label,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { Constants, MongoCollections } from "../../Constants";
  import { mongo, realmApp } from "../../main";
  import * as Realm from "realm-web";
  import type { UserData } from "../models/UserData/UserData";
  import { AccountRole } from "../enums/AccountRole";
  import BookRow from "../components/Books/BookRow.svelte";
  import type { Writable } from "svelte/store";
  import { notifications } from "../tools/notifications";
  import Toast from "../components/Toast.svelte";
  import { BooksRepository } from "../repositories/BooksRepository";
  import { Book, type IBook } from "../models/Books/Book";
  import type { Borrow } from "../models/Borrowings/Borrow";
  import type { Return } from "../models/Borrowings/Return";

  let isLoading = true;
  var user: UserData;
  var selectedSection: String = "All";
  const {
    BSON: { ObjectId },
  } = Realm;

  onMount(async () => {
    await getCurrentUser();
    await getBorrowings();
    await getReturns();
    await getBooks();
  });

  var books = new Array<Book>();
  var renderBooks = new Array<Book>();
  var borrowings = new Array<Borrow>();
  var returns = new Array<Return>();

  async function getBooks() {
    const data = mongo.collection(MongoCollections.Books);
    const result = (await data.find()) as Book[];
    books = result;
    renderBooks = books;
    isLoading = false;
  }
  async function getBorrowings() {
    //TODO user filter
    const data = mongo.collection(MongoCollections.Borrowings);
    const result = (await data.find()) as Borrow[];
    borrowings = result;
  }
  async function getReturns() {
    //TODO user filter
    const data = mongo.collection(MongoCollections.BorrowHistory);
    const result = (await data.find()) as Return[];
    returns = result;
  }
  async function getCurrentUser() {
    const data = mongo.collection(MongoCollections.Users);
    const result = (await data.find()) as UserData[];
    user = result.find((u) => u.personalId === realmApp.currentUser.id);
  }

  function onBorrowOrReturnBook(id: string, data: IBook): void {
    if (
      isBorrowed(renderBooks.find((b) => b._id.toString() === id.toString()))
    ) {
      BooksRepository.returnBook(id, data);
      return;
    }

    if (renderBooks.find((b) => b._id === id).availableCount === 0) {
      notifications.warning("No books left to borrow!", 3000);
    } else {
      BooksRepository.borrowBook(id, data);
    }
  }
  function isBorrowed(book: Book): boolean {
    return (
      borrowings.find(
        (b) =>
          b.bookId.toString() === book._id.toString() &&
          b.userId === user.personalId
      ) !== undefined
    );
  }
  function onSaveEdit(id: string, data: IBook): void {
    BooksRepository.saveBookChanges(id, data);
  }

  function onSearchChanged(e): void {
    if (!e.target.value) {
      updateBooks();
    } else {
      switch (selectedSection) {
        case "Borrowed":
          renderBooks = books.filter(
            (b) =>
              isBorrowed(b) &&
              b.name.toLowerCase().includes(e.target.value.toLowerCase())
          );
          break;
        case "History":
          break;

        default:
          renderBooks = books.filter((b) =>
            b.name.toLowerCase().includes(e.target.value.toLowerCase())
          );
          break;
      }
    }
  }

  function onSectionChanged(section: String) {
    selectedSection = section;
    updateBooks();
  }

  function updateBooks(): void {
    switch (selectedSection) {
      case "Borrowed":
        renderBooks = books.filter((b) => isBorrowed(b));
        break;
      case "History":
        let returnedBooks = getReturnedBooks();
        renderBooks = returnedBooks;
        break;

      default:
        renderBooks = books;
        break;
    }
  }

  function getReturnedBooks(): Array<Book> {
    let arr = new Array<Book>();
    for (let i = 0; i < returns.length; i++) {
      let book = books.find(
        (b) => b._id.toString() === returns[i].bookId.toString()
      );

      arr.push(
        new Book(
          book._id,
          book.name,
          book.author,
          book.pagesCount,
          book.releaseYear,
          book.img,
          book.availableCount,
          book.borrowedCount
        )
      );
    }
    return arr;
  }

  //TODO handle via CRON/Function/trigger
  function getBookExpirationDate(book: Book): string {
    let bor = borrowings.find(
      (b) => b.bookId.toString() === book._id.toString()
    );

    if(!bor) return "";

    let returnDate = addDays(bor.borrowDate, 6);

    return returnDate.toLocaleDateString("en-US");
  }

  function addDays(date: Date, days) {
    var result = new Date(date.toUTCString());
    result.setDate(result.getDate() + days);
    return result;
  }
  function getBookReturnDate(book: Book): string {
    let ret = returns
      .filter((r) => r.bookId.toString() === book._id.toString())
      .sort((a, b) => b.returnDate.getDate() - a.returnDate.getDate());

    return ret.at(0).returnDate.toLocaleDateString("en-US");
  }
</script>

<div class="flex flex-row justify-between">
  <h1 class="text-black">Books</h1>
</div>
<div class="h-12" />
<ButtonGroup>
  <Button
    color={selectedSection === "All" ? "blue" : "light"}
    on:click={() => onSectionChanged("All")}>All</Button
  >
  <Button
    color={selectedSection === "Borrowed" ? "blue" : "light"}
    on:click={() => onSectionChanged("Borrowed")}>Borrowed</Button
  >
  <Button
    color={selectedSection === "History" ? "blue" : "light"}
    on:click={() => onSectionChanged("History")}>History</Button
  >
</ButtonGroup>
<div>
  <div class="h-12" />
  <Input
    type="text"
    id="search"
    placeholder="Search..."
    on:change={(e) => onSearchChanged(e)}
  />
</div>
<div class="h-24" />
{#if !isLoading}
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Author</TableHeadCell>
      <TableHeadCell>Pages count</TableHeadCell>
      <TableHeadCell>Release year</TableHeadCell>
      <TableHeadCell>Image</TableHeadCell>
      {#if selectedSection !== "History"}
        <TableHeadCell>Available count</TableHeadCell>
        <TableHeadCell>Borrowed count</TableHeadCell>
      {/if}
      {#if selectedSection !== "History"}
        <TableHeadCell>Expires</TableHeadCell>
      {:else}
        <TableHeadCell>Return date</TableHeadCell>
      {/if}
    </TableHead>
    <TableBody class="divide-y">
      {#each renderBooks as book}
        <BookRow
          {book}
          canEdit={user.role === AccountRole.Admin}
          {onBorrowOrReturnBook}
          {onSaveEdit}
          {isBorrowed}
          isHistory={selectedSection === "History"}
          {getBookExpirationDate}
          {getBookReturnDate}
        />
      {/each}
    </TableBody>
  </Table>
{:else}
  <Spinner />
{/if}

<Toast />
