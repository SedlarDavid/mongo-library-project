<script lang="ts">
  import {
    Avatar,
    Button,
    ButtonGroup,
    Fileupload,
    Input,
    Label,
    Select,
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
  import { realmApp } from "../../main";
  import * as Realm from "realm-web";
  import type { UserData } from "../models/UserData/UserData";
  import { AccountRole } from "../enums/AccountRole";
  import BookRow from "../components/Books/BookRow.svelte";
  import NewBookRow from "../components/Books/NewBookRow.svelte";
  import { writable, type Writable } from "svelte/store";
  import { notifications } from "../tools/notifications";
  import Toast from "../components/Toast.svelte";
  import { BooksRepository } from "../repositories/BooksRepository";
  import { Book, type IBook } from "../models/Books/Book";
  import type { Borrow } from "../models/Borrowings/Borrow";
  import type { Return } from "../models/Borrowings/Return";
  import { ImportRepository } from "../repositories/ImportRepository";
  import { AccountState } from "../enums/AccountState";

  const mongo = realmApp.currentUser
    .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
    .db(Constants.DatabaseName);

  let isLoading = true;
  var user: UserData;
  var users: UserData[];
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
    users = result;
    user = result.find((u) => u.personalId === realmApp.currentUser.id);
  }

  function onBorrowOrReturnBook(id: string, data: IBook): void {
    if (user.accountState === AccountState.Inactive) {
      notifications.danger(
        "Innactive users cannot borrow books, please refer to your librarian!",
        3000
      );

      return;
    }

    if (
      borrowings.filter((b) => b.userId === realmApp.currentUser.id.toString())
        .length === 6
    ) {
      notifications.warning(
        "You can't borrow more than six book, return some first!",
        3000
      );

      return;
    }

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

  let search = writable<IBook>({
    _id: null,
    author: null,
    name: null,
    releaseYear: null,
    pagesCount: null,
    img: null,
    borrowedCount: null,
    availableCount: null,
  });

  async function querySearch(): Promise<void> {
    if (
      $search.name.length < 3 ||
      $search.author.length < 3 ||
      $search.releaseYear.toString().length < 3
    ) {
      notifications.info(
        "Search parameters must have at least three characters",
        3000
      );
      return;
    }
    const searchQuery = {
      $or: [
        { author: { $regex: `.*${$search.author}.*`, $options: "i" } },
        { name: { $regex: `.*${$search.name}.*`, $options: "i" } },
        {
          releaseYear: {
            $regex: `.*${$search.releaseYear}.*`,
            $options: "i",
          },
        },
      ],
    };

    const data = mongo.collection(MongoCollections.Books);
    const result = (await data.find(searchQuery)) as Book[];
    books = result;
    updateBooks();
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

    if (!bor) return "";

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

  function onBookDelete(id: string) {
    let index = books.findIndex((b) => b._id.toString() === id.toString());
    if (index > -1) {
      books.splice(index, 1);
    }
    BooksRepository.deleteBook(id);
  }
  async function onAddBook(data: IBook): Promise<void> {
    isLoading = true;
    let newBook = new Book(
      data._id,
      data.name,
      data.author,
      data.pagesCount,
      data.releaseYear,
      data.img,
      data.availableCount,
      data.borrowedCount
    );
    let id = await BooksRepository.addBook(newBook);
    newBook._id = id.toString();
    books.push(newBook);
    isLoading = false;
    updateBooks();
  }

  async function exportBooks() {
    const books = mongo.collection(MongoCollections.Books);
    var result = await books.find();
    const data = JSON.stringify(result);

    var a = document.createElement("a");
    var file = new Blob([data], { type: "application/json" });
    a.href = URL.createObjectURL(file);
    a.download = "books.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  var jsonData;
  function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const contents = event.target.result;
      // do something with the contents
      console.log(contents);
      jsonData = JSON.parse(contents as string);

      (jsonData as Array<object>).forEach((obj) =>
        BooksRepository.importBookData(obj)
      );
    };
    reader.readAsText(file);
  }
  import { modal } from "../stores.js";
  import Dialog from "../components/Dialog.svelte";

  let showModal = false;

  let selectedUser;
  let selectedBook;

  function assignBooksToUsers(): void {
    var book =   books.find((b) => b._id.toString() === selectedBook);
    if(book.availableCount ===0 ){
      notifications.warning(
        "Book has no free copies left!",
        3000
      );
      return;
    }
    BooksRepository.borrowBookToUser(
    book,
      selectedUser
    );
  }
</script>

<div class="flex flex-row justify-between">
  <h1 class="text-black">Books</h1>
  <div>
    <div class="flex flex-column justify-between gap-2">
      <Button on:click={exportBooks}>Export books data</Button>

      <Button
        on:click={() => {
          if (user.role !== AccountRole.Admin) {
            return;
          }
          showModal = true;
        }}>Assign books to users</Button
      >
    </div>

    <br />
    <Label for="import">Upload file to import:</Label>
    <input type="file" on:change={handleFile} />
  </div>
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
  <div class="flex flex-row justify-between gap-4">
    <Input
      minlength="3"
      bind:value={$search.name}
      type="text"
      id="name"
      placeholder="Bible"
    />
    <Input
      minlength="3"
      bind:value={$search.author}
      type="text"
      id="author"
      placeholder="Jaro Kroupa"
    />

    <Input
      minlength="3"
      bind:value={$search.releaseYear}
      type="text"
      id="releaseYear"
      placeholder="1995"
    />
    <Button on:click={querySearch}>Search</Button>
  </div>
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
          {onBookDelete}
        />
      {/each}
      {#if user.role === AccountRole.Admin && selectedSection === "All"}
        <NewBookRow {onAddBook} />
      {/if}
    </TableBody>
  </Table>
{:else}
  <Spinner />
{/if}

<Toast />

{#if showModal}
  <Dialog on:close={() => (showModal = false)} onClose={assignBooksToUsers}>
    <Label
      >Select an user
      <Select
        class="mt-2"
        items={users.map((currentValue) => ({
          value: currentValue.personalId,
          name: currentValue.name,
        }))}
        bind:value={selectedUser}
      />
    </Label>
    <Label
      >Select a book
      <Select
        class="mt-2"
        items={books.map((currentValue) => ({
          value: currentValue._id.toString(),
          name: currentValue.name,
        }))}
        bind:value={selectedBook}
      />
    </Label>
  </Dialog>
{/if}
