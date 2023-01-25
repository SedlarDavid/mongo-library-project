<script lang="ts">
  import { Button, ButtonGroup, Input, Spinner } from 'flowbite-svelte';
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
  import { AccountState } from '../enums/AccountState';

  let isLoading = true;
  const {
    BSON: { ObjectId },
  } = Realm;

  onMount(async () => {
    await getUser();
  });

  var user: UserData;

  async function getUser() {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );

    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users);
    const result = (await data.find()) as UserData[];
    user = result.find((user) => user.personalId === realmApp.currentUser.id);
    isLoading = false;
  }

  async function onSaveAll(e: MouseEvent) {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );

    const data = await mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users)
      .updateOne(
        { personalId: realmApp.currentUser.id },
        {
          $set: {
            name: user.name,
            surname: user.surname,
            nationalIdNumber: user.nationalIdNumber,
            nickname: user.nickname,
            email: user.email,
            address: user.address,
            accountState: 1,
          },
        }
      );
    getUser();
  }
</script>

<div class="flex flex-row justify-between">
  <h1 class="text-black">My profile</h1>
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
      <TableHeadCell>National ID Number</TableHeadCell>
      <TableHeadCell>Nickname</TableHeadCell>
      <TableHeadCell>Email</TableHeadCell>
      <TableHeadCell>Address</TableHeadCell>
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
            bind:value={user.name}
          />
        </TableBodyCell>
        <TableBodyCell>
          <Input
            type="text"
            id="surname"
            placeholder="Surname"
            required
            bind:value={user.surname}
          /></TableBodyCell
        >
        <TableBodyCell>
          <Input
            type="text"
            id="nationalIdNumber"
            placeholder="National ID Number"
            required
            bind:value={user.nationalIdNumber}
          /></TableBodyCell
        >
        <TableBodyCell>
          <Input
            type="text"
            id="nickname"
            placeholder="Nickname"
            required
            bind:value={user.nickname}
          /></TableBodyCell
        >
        <TableBodyCell>
          <Input
            type="text"
            id="email"
            placeholder="Email"
            required
            bind:value={user.email}
          /></TableBodyCell
        >
        <TableBodyCell>
          <Input
            type="text"
            id="address"
            placeholder="Address"
            required
            bind:value={user.address}
          /></TableBodyCell
        >
        <TableBodyCell>{AccountState[user.accountState]}</TableBodyCell>
      </TableBodyRow>

      <TableBodyRow />
    </TableBody>
  </Table>
{:else}
  <Spinner />
{/if}
