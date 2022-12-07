<script lang="ts">
  import { Button, Input, Label, Spinner } from "flowbite-svelte";
  import { writable } from "svelte/store";
  import * as Realm from "realm-web";
  import { realmApp } from "../../../main";
  import { Constants, MongoCollections } from "../../../Constants";
  import { onMount } from "svelte";
  import { UserData } from "../../models/UserData/UserData";
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

  let isLoading = true;
  const {
    BSON: { ObjectId },
  } = Realm;

  onMount(async () => {
    await getUsers();
  });

  var users = new Array<UserData>();

  async function getUsers() {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );
    const data = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users);
    const result = (await data.find()) as UserData[];
    console.log(result[0].name);
    users = result;
    isLoading = false;
  }
</script>

<h1 class="text-black">Users</h1>
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
          <TableBodyCell>{user.name}</TableBodyCell>
          <TableBodyCell>{user.surname}</TableBodyCell>
          <TableBodyCell>{user.nickname}</TableBodyCell>
          <TableBodyCell>{user.email}</TableBodyCell>
          <TableBodyCell>{user.address}</TableBodyCell>
          <TableBodyCell>{AccountRole[user.role]}</TableBodyCell>
          <TableBodyCell>{AccountState[user.accountState]}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{:else}
  <Spinner />
{/if}
