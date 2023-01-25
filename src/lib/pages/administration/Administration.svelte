<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownItem,
    Input,
    Label,
    Select,
    Spinner,
  } from "flowbite-svelte";
  import { writable } from "svelte/store";
  import * as Realm from "realm-web";
  import { mongo, realmApp } from "../../../main";
  import { Constants, MongoCollections } from "../../../Constants";
  import { onMount } from "svelte";
  import type { UserData } from "../../models/UserData/UserData";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { AccountRole } from "../../enums/AccountRole";
  import { AccountState } from "../../enums/AccountState";
  import { each } from "svelte/internal";

  let isLoading = true;
  const {
    BSON: { ObjectId },
  } = Realm;

  onMount(async () => {
    await getUsers();
  });

  var users = new Array<UserData>();

  async function getUsers() {
    const data = mongo
      .collection(MongoCollections.Users);
    const result = (await data.find()) as UserData[];
    console.log(result[0].name);
    users = result;
    isLoading = false;
  }

  function onSaveAll(e: MouseEvent): void {
    throw new Error("Function not implemented.");
  }

  function onApproveUser(user: UserData): void {
    throw new Error("Function not implemented.");
  }
</script>

<div class="flex flex-row justify-between">
  <h1 class="text-black">Users</h1>
  <ButtonGroup>
    <Button on:click={onSaveAll}>Save all</Button>
  </ButtonGroup>
</div>
<div class="h-24" />
{#if !isLoading}
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Surname</TableHeadCell>
      <TableHeadCell>Nickname</TableHeadCell>
      <TableHeadCell>Email</TableHeadCell>
      <TableHeadCell>Address</TableHeadCell>
      <TableHeadCell>Role</TableHeadCell>
      <TableHeadCell>Account state</TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
      {#each users as user}
        <TableBodyRow>
          <TableBodyCell>
            <Input
              type="text"
              id="name"
              placeholder="John"
              required
              bind:value={user.name}
            />
          </TableBodyCell>
          <TableBodyCell>
            <Input
              type="text"
              id="surname"
              placeholder="Wick"
              required
              bind:value={user.surname}
            /></TableBodyCell
          >
          <TableBodyCell>
            <Input
              type="text"
              id="nickname"
              placeholder="John"
              required
              bind:value={user.nickname}
            /></TableBodyCell
          >
          <TableBodyCell>
            <Input
              type="text"
              id="email"
              placeholder="John"
              required
              bind:value={user.email}
            /></TableBodyCell
          >
          <TableBodyCell>
            <Input
              type="text"
              id="address"
              placeholder="John"
              required
              bind:value={user.address}
            /></TableBodyCell
          >
          <TableBodyCell>
            <Label>Select an option
              <!-- <Select class="mt-2" items={Object.keys(AccountRole).map()} bind:value={user.role} /> -->
            </Label>
          </TableBodyCell>
          <TableBodyCell>{AccountState[user.accountState]}</TableBodyCell>
          <TableBodyCell>
            <Button
              on:click={() => onApproveUser(user)}
              pill={true}
              class="!p-2"
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
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{:else}
  <Spinner />
{/if}
