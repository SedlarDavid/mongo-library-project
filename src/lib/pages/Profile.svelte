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
  } from 'flowbite-svelte';
  import { writable } from 'svelte/store';
  import * as Realm from 'realm-web';
  import { realmApp } from '../../main';
  import { Constants, MongoCollections } from '../../Constants';
  import { onMount } from 'svelte';
  import type { UserData } from '../models/UserData/UserData';
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from 'flowbite-svelte';
  import { AccountRole } from '../enums/AccountRole';
  import { AccountState } from '../enums/AccountState';
  import { each } from 'svelte/internal';

  let isLoading = true;
  const {
    BSON: { ObjectId },
  } = Realm;

  onMount(async () => {
    await getUser();
  });

  var users = new Array<UserData>();

  var currentUser = realmApp.currentUser.profile.name;

  async function getUser() {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );

    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users)
      .findOne({ name: currentUser });
    const result = (await data) as UserData[];
    console.log(currentUser);
    users = result;
    isLoading = false;
  }

  function onSaveAll(e: MouseEvent): void {
    throw new Error('Function not implemented.');
  }
</script>

<div class="flex flex-row justify-between">
  <h1 class="text-black">Users profile</h1>
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
      <TableBodyRow>
        <TableBodyCell>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            required
            bind:value={users[0].name}
          />
        </TableBodyCell>
        <TableBodyCell>
          <Input
            type="text"
            id="surname"
            placeholder="Surname"
            required
            bind:value={users[0].surname}
          /></TableBodyCell
        >
        <TableBodyCell>
          <Input
            type="text"
            id="nickname"
            placeholder="Nickname"
            required
            bind:value={users[0].nickname}
          /></TableBodyCell
        >
        <TableBodyCell>
          <Input
            type="text"
            id="email"
            placeholder="Email"
            required
            bind:value={users[0].email}
          /></TableBodyCell
        >
        <TableBodyCell>
          <Input
            type="text"
            id="address"
            placeholder="Address"
            required
            bind:value={users[0].address}
          /></TableBodyCell
        >
        <TableBodyCell />
        <TableBodyCell>{AccountState[users[0].accountState]}</TableBodyCell>
      </TableBodyRow>
    </TableBody>
  </Table>
{:else}
  <Spinner />
{/if}
