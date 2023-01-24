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

  export let onAddBook: (book: IBook) => void;
</script>

<TableBodyRow trClass="bg-black-200">
  <TableBodyCell>
    <Input
      type="text"
      id="name"
      placeholder="Z lesa do lesa"
      required
      bind:value={$bookFormData.name}
    />
  </TableBodyCell>
  <TableBodyCell>
    <Input
      type="text"
      id="author"
      placeholder="Lojzik Tomek"
      required
      bind:value={$bookFormData.author}
    />
  </TableBodyCell>
  <TableBodyCell>
    <Input
      type="text"
      id="pagesCount"
      placeholder="255"
      required
      bind:value={$bookFormData.pagesCount}
    />
  </TableBodyCell>
  <TableBodyCell>
    <Input
      type="text"
      id="releaseYear"
      placeholder="1995"
      required
      bind:value={$bookFormData.releaseYear}
    />
  </TableBodyCell>
  <TableBodyCell>
    <Avatar src={$bookFormData.img} rounded />
  </TableBodyCell>

  <TableBodyCell>
    <Input
      type="text"
      id="availableCount"
      placeholder="5"
      required
      bind:value={$bookFormData.availableCount}
    />
  </TableBodyCell>
  <TableBodyCell>
    <Input
      type="text"
      id="borrowedCount"
      placeholder="5"
      required
      bind:value={$bookFormData.borrowedCount}
    />
  </TableBodyCell>
  <TableBodyCell />
  <TableBodyCell>
    <Button
      color="redToYellow"
      outline={true}
      on:click={() => onAddBook($bookFormData)}
      pill={true}>Add</Button
    >
  </TableBodyCell>
</TableBodyRow>
