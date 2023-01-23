<script lang="ts">
  import {
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
  import type { Book } from "../models/Books/Book";
  import * as Realm from "realm-web";
  import type { UserData } from "../models/UserData/UserData";
  import { AccountRole } from "../enums/AccountRole";
  import type { Borrowing } from "../models/Borrowings/Borrowing";

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

  async function getBooks() {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );
    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Books);
    const result = (await data.find()) as Book[];
    books = result;
    renderBooks = books;
    isLoading = false;
  }
  async function getBorrowings() {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );
    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Borrowings);
    const result = (await data.find()) as Borrowing[];
    borrowings = result;
  }

  async function getCurrentUser() {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );
    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users);
    const result = (await data.find()) as UserData[];
    user = result.find((u) => u.personalId === realmApp.currentUser.id);
  }

  function onBorrowBook(book: Book): void {
    throw new Error("Function not implemented.");
  }
  function isBorrowed(book: Book): boolean {
    return (
      borrowings.find(
        (b) => b.bookId === book._id.toString() && b.userId === user.personalId
      ) !== undefined
    );
  }
  function onEditBook(book: Book): void {
    throw new Error("Function not implemented.");
  }

  function onSearchChanged(e): void {
    console.log(e.target.value);
  }

  function onSectionChanged(section: String) {
    selectedSection = section;
    updateBooks();
  }

  function updateBooks(): void {
    switch (selectedSection) {
      case "Borrowed":
        renderBooks = books.filter(b => isBorrowed(b));
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
        <TableBodyRow trClass={isBorrowed(book) ? "bg-green-200" : ""}>
          <TableBodyCell>
            {book.name}
          </TableBodyCell>
          <TableBodyCell>
            {book.author}
          </TableBodyCell>
          <TableBodyCell>
            {book.pagesCount}</TableBodyCell
          >
          <TableBodyCell>
            {book.releaseYear}</TableBodyCell
          >
          <TableBodyCell>
            {book.img}</TableBodyCell
          >
          <TableBodyCell>
            {book.availableCount}
          </TableBodyCell>
          <TableBodyCell>{book.borrowedCount}</TableBodyCell>
          <TableBodyCell>
            <Button on:click={() => onBorrowBook(book)} pill={true} class="!p-2"
              ><svg
                aria-hidden="true"
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                /></svg
              ></Button
            >
            {#if user.role === AccountRole.Admin}
              <Button on:click={() => onEditBook(book)} pill={true} class="!p-2"
                ><svg
                  aria-hidden="true"
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  /></svg
                ></Button
              >
            {/if}
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{:else}
  <Spinner />
{/if}
