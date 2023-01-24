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
  import { realmApp } from "../../main";
  import { Book, type IBook } from "../models/Books/Book";
  import * as Realm from "realm-web";
  import type { UserData } from "../models/UserData/UserData";
  import { AccountRole } from "../enums/AccountRole";
  import { Borrowing } from "../models/Borrowings/Borrowing";
  import BookRow from "../components/Books/BookRow.svelte";
  import type { Writable } from "svelte/store";
  import { notifications } from "../tools/notifications";
  import Toast from "../components/Toast.svelte";

  let isLoading = true;
  var user: UserData;
  var selectedSection: String = "All";
  const {
    BSON: { ObjectId },
  } = Realm;

  onMount(async () => {
    await getCurrentUser();
    await getBorrowings();
    await getBooks();
  });

  var books = new Array<Book>();
  var renderBooks = new Array<Book>();
  var borrowings = new Array<Borrowing>();
  const mongo = realmApp.currentUser.mongoClient(
    import.meta.env.VITE_DATA_SOURCE_NAME
  );

  async function getBooks() {
    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Books);
    const result = (await data.find()) as Book[];
    books = result;
    renderBooks = books;
    isLoading = false;
  }
  async function getBorrowings() {
    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Borrowings);
    const result = (await data.find()) as Borrowing[];
    borrowings = result;
  }

  async function getCurrentUser() {
    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users);
    const result = (await data.find()) as UserData[];
    user = result.find((u) => u.personalId === realmApp.currentUser.id);
  }

  function onBorrowBook(id: string, data: IBook): void {
    if (renderBooks.find((b) => b._id === id).availableCount === 0) {
      notifications.warning("No books left to borrow!", 3000);
    } else {
      data.availableCount--;
      data.borrowedCount++;
      mongo
        .db(Constants.DatabaseName)
        .collection(MongoCollections.Books)
        .updateOne({ _id: id }, { $set: Book.fromFormData(data) });
      //TODO via Trigger
      mongo
        .db(Constants.DatabaseName)
        .collection(MongoCollections.Borrowings)
        .insertOne(new Borrowing(id, user.personalId, new Date()));
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
    mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Books)
      .updateOne({ _id: id }, { $set: Book.fromFormData(data) });
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
        break;

      default:
        renderBooks = books;
        break;
    }
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
      <TableHeadCell>Available count</TableHeadCell>
      <TableHeadCell>Borrowed count</TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
      {#each renderBooks as book}
        <BookRow
          {book}
          canEdit={user.role === AccountRole.Admin}
          {onBorrowBook}
          {onSaveEdit}
          {isBorrowed}
        />
      {/each}
    </TableBody>
  </Table>
{:else}
  <Spinner />
{/if}

<Toast />
