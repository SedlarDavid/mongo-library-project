<script lang="ts">
  import {
    Avatar,
    Button,
    Input,
    TableBodyCell,
    TableBodyRow,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import type { Book, IBook } from "../../models/Books/Book";

  export let book: Book;
  export let canEdit: boolean = false;
  export let isHistory: boolean = false;
  export let onBorrowOrReturnBook: (id: string, data: IBook) => void;
  export let onSaveEdit: (id: string, data: IBook) => void;
  export let isBorrowed: (book: Book) => boolean;
  export let getBookExpirationDate: (book: Book) => string;
  export let getBookReturnDate: (book: Book) => string;
  export let onBookDelete: (id:string) => void;
  const bookFormData = writable<IBook>({
    _id: "",
    name: "",
    author: "",
    pagesCount: 0,
    releaseYear: 0,
    img: "",
    availableCount: 0,
    borrowedCount: 0,
  });

  onMount(() => {
    bookFormData.set(book);
  });
</script>

<TableBodyRow trClass={isBorrowed(book) ? "bg-green-200" : ""}>
  <TableBodyCell>
    {#if canEdit}
      <Input
        type="text"
        id="name"
        placeholder="Z lesa do lesa"
        required
        bind:value={$bookFormData.name}
      />
    {:else}
      {book.name}
    {/if}
  </TableBodyCell>
  <TableBodyCell>
    {#if canEdit}
      <Input
        type="text"
        id="author"
        placeholder="Lojzik Tomek"
        required
        bind:value={$bookFormData.author}
      />
    {:else}
      {book.author}
    {/if}
  </TableBodyCell>
  <TableBodyCell>
    {#if canEdit}
      <Input
        type="text"
        id="pagesCount"
        placeholder="255"
        required
        bind:value={$bookFormData.pagesCount}
      />
    {:else}
      {book.pagesCount}
    {/if}
  </TableBodyCell>
  <TableBodyCell>
    {#if canEdit}
      <Input
        type="text"
        id="releaseYear"
        placeholder="1995"
        required
        bind:value={$bookFormData.releaseYear}
      />
    {:else}
      {book.releaseYear}
    {/if}
  </TableBodyCell>
  <TableBodyCell>
    <Avatar src={$bookFormData.img} rounded />
  </TableBodyCell>
  {#if !isHistory}
    <TableBodyCell>
      {#if canEdit}
        <Input
          type="text"
          id="availableCount"
          placeholder="5"
          required
          bind:value={$bookFormData.availableCount}
        />
      {:else}
        {book.availableCount}
      {/if}
    </TableBodyCell>
    <TableBodyCell>
      {#if canEdit}
        <Input
          type="text"
          id="borrowedCount"
          placeholder="5"
          required
          bind:value={$bookFormData.borrowedCount}
        />
      {:else}
        {book.borrowedCount}
      {/if}
    </TableBodyCell>
    <TableBodyCell>
      {#if !isHistory}
        {getBookExpirationDate(book)}
      {:else}
        {getBookReturnDate(book)}
      {/if}
    </TableBodyCell>
    <TableBodyCell>
      <Button
        color={isBorrowed(book) ? "red" : "green"}
        outline={true}
        on:click={canEdit
          ? () => onSaveEdit(book._id, $bookFormData)
          : () => onBorrowOrReturnBook(book._id, $bookFormData)}
        pill={true}
        >{canEdit ? "Save" : isBorrowed(book) ? "Return" : "Borrow"}</Button
      >
      {#if canEdit}
        <Button
          color="red"
          on:click={() => onBookDelete(book._id)}
          pill={true}>Delete</Button
        >
      {/if}
    </TableBodyCell>
  {/if}
</TableBodyRow>
