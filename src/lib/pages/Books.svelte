<script lang="ts">
  import {
    Button,
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

  let isLoading = true;
  var user: UserData;
  const {
    BSON: { ObjectId },
  } = Realm;

  onMount(async () => {
    await getCurrentUser();
    await getBooks();
  });

  var books = new Array<Book>();

  async function getBooks() {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );
    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Books);
    const result = (await data.find()) as Book[];
    books = result;
    isLoading = false;
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
    console.log(user);

  }

  function onBorrowBook(book: Book): void {
    throw new Error("Function not implemented.");
  }
  function onEditBook(book: Book): void {
    throw new Error("Function not implemented.");
  }
</script>

<div class="flex flex-row justify-between">
  <h1 class="text-black">Books</h1>
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
      {#each books as book}
        <TableBodyRow>
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
