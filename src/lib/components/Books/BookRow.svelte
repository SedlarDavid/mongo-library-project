<script lang="ts">
  import {
    Avatar,
    Button,
    Input,
    TableBodyCell,
    TableBodyRow,
  } from "flowbite-svelte";
  import type { Book } from "../../models/Books/Book";

  export let book: Book;
  export let canEdit: boolean = false;
  export let onBorrowBook: (book: Book) => void;
  export let onSaveEdit: (book: Book) => void;
  export let isBorrowed: (book: Book) => boolean;
</script>

<TableBodyRow trClass={isBorrowed(book) ? "bg-green-200" : ""}>
  <TableBodyCell>
    {#if canEdit}
      <Input
        type="text"
        id="name"
        placeholder="Z lesa do lesa"
        required
        bind:value={book.name}
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
        bind:value={book.author}
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
        bind:value={book.pagesCount}
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
        bind:value={book.releaseYear}
      />
    {:else}
      {book.releaseYear}
    {/if}
  </TableBodyCell>
  <TableBodyCell>
    <Avatar src={book.img} rounded />
  </TableBodyCell>
  <TableBodyCell>
    {#if canEdit}
      <Input
        type="text"
        id="availableCount"
        placeholder="5"
        required
        bind:value={book.availableCount}
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
        bind:value={book.borrowedCount}
      />
    {:else}
      {book.borrowedCount}
    {/if}
  </TableBodyCell>
  <TableBodyCell>
    {#if !canEdit}
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
      >{/if}

    {#if canEdit}
      <Button on:click={() => onSaveEdit(book)} pill={true} class="!p-2"
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
