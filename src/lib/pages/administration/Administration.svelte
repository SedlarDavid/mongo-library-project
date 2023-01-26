<script lang="ts">
  import {
    Button,
    Input,
    Label,
    Radio,
    Select,
    Spinner,
  } from 'flowbite-svelte';

  import * as Realm from 'realm-web';
  import { mongo, realmApp } from '../../../main';
  import { Constants, MongoCollections } from '../../../Constants';
  import { getAllContexts, onMount } from 'svelte';
  import type { UserData } from '../../models/UserData/UserData';
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from 'flowbite-svelte';
  import { AccountRole } from '../../enums/AccountRole';
  import { AccountState } from '../../enums/AccountState';

  let isLoading = true;
  const {
    BSON: { ObjectId },
  } = Realm;

  onMount(async () => {
    await getUsers();
  });

  var users = new Array<UserData>();
  let isFormOpen = false;

  async function getUsers() {
    const data = mongo.collection(MongoCollections.Users);
    const result = (await data.find()) as UserData[];
    users = result;
    isLoading = false;
  }

  async function download() {
    const users = mongo.collection(MongoCollections.Users);
    var result = await users.find();
    const data = JSON.stringify(result);
    console.log(data);

    var a = document.createElement('a');
    var file = new Blob([data], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'json.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function onSaveUser(user: UserData) {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );

    const data = await mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users)
      .updateOne(
        { personalId: user.personalId },
        {
          $set: {
            name: user.name,
            surname: user.surname,
            nationalIdNumber: user.nationalIdNumber,
            nickname: user.nickname,
            email: user.email,
            address: user.address,
            role: user.role,
          },
        }
      );
    getUsers();
  }

  async function onDeleteUser(user: UserData) {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );
    realmApp.currentUser.customData;

    const data = await mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users)
      .deleteOne({ personalId: user.personalId });
    getUsers();
  }

  async function onChangeActivityStateOfUser(user: UserData) {
    var state: AccountState;
    if (user.accountState === 0) {
      state = 1;
    } else state = 0;

    const data = await mongo.collection(MongoCollections.Users).updateOne(
      { personalId: user.personalId },
      {
        $set: {
          accountState: state,
        },
      }
    );
    getUsers();
  }

  async function onChangeBanStateOfUser(user: UserData) {
    var state: AccountState;
    if (user.accountState === 2) {
      state = 1;
    } else state = 2;

    const data = await mongo.collection(MongoCollections.Users).updateOne(
      { personalId: user.personalId },
      {
        $set: {
          accountState: state,
        },
      }
    );
    getUsers();
  }

  async function onSubmit(_e) {
    isLoading = true;
  }
</script>

<Button on:click={() => (isFormOpen = !isFormOpen)}>
  {isFormOpen ? 'Close' : 'Open'} form to create new user
</Button>

<form
  style="display: {isFormOpen ? 'block' : 'none'}"
  on:submit|preventDefault={onSubmit}
>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="name" class="mb-2 text-white">Name</Label>
      <Input type="text" id="name" placeholder="Name" required />
    </div>
    <div>
      <Label for="surname" class="mb-2 text-white">Surname</Label>
      <Input type="text" id="surname" placeholder="Doe" required />
    </div>
    <div>
      <Label for="nationalIdNumber" class="mb-2 text-white"
        >National ID Number</Label
      >
      <Input
        type="text"
        id="nationalIdNumber"
        placeholder="981205/5578"
        required
      />
    </div>
    <div>
      <Label for="address" class="mb-2 text-white">Address</Label>
      <Input type="text" id="address" placeholder="Na Stráni 553" required />
    </div>
  </div>
  <div class="mb-6">
    <Label for="email" class="mb-2 text-white">Email address</Label>
    <Input
      type="email"
      id="email"
      placeholder="john.doe@company.com"
      required
    />
  </div>
  <Button type="submit" color="yellow" on:click={onSubmit}>Submit</Button>
</form>

<Button on:click={() => download()}>Export users</Button>

<div class="flex flex-row justify-between">
  <h1 class="text-black">Users</h1>
</div>
<div class="h-18" />
{#if !isLoading}
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Surname</TableHeadCell>
      <TableHeadCell>National ID Number</TableHeadCell>
      <TableHeadCell>Nickname</TableHeadCell>
      <TableHeadCell>Email</TableHeadCell>
      <TableHeadCell>Address</TableHeadCell>
      <TableHeadCell>Role</TableHeadCell>
      <TableHeadCell>Account state</TableHeadCell>
      <TableHeadCell>Change activity state</TableHeadCell>
      <TableHeadCell>Change ban state</TableHeadCell>
      <TableHeadCell>Save edited data</TableHeadCell>
      <TableHeadCell>Delete user</TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
      {#each users as user}
        <TableBodyRow>
          <TableBodyCell>
            <Input
              type="text"
              id="name"
              placeholder="Jason"
              required
              bind:value={user.name}
            />
          </TableBodyCell>
          <TableBodyCell>
            <Input
              type="text"
              id="surname"
              placeholder="Bourne"
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
              placeholder="JaBo"
              required
              bind:value={user.nickname}
            /></TableBodyCell
          >
          <TableBodyCell>
            <Input
              type="text"
              id="email"
              placeholder="jason.bourne@oblivion.com"
              required
              bind:value={user.email}
            /></TableBodyCell
          >
          <TableBodyCell>
            <Input
              type="text"
              id="address"
              placeholder="Oblivion street 1, NY, USA"
              required
              bind:value={user.address}
            /></TableBodyCell
          >
          <TableBodyCell>
            <select bind:value={user.role}>
              <option selected={user.role === 0} value={0}
                >{AccountRole[0]}</option
              >
              <option selected={user.role === 1} value={1}
                >{AccountRole[1]}</option
              >
              <option selected={user.role === 2} value={2}
                >{AccountRole[2]}</option
              >
            </select>
          </TableBodyCell>
          <TableBodyCell>{AccountState[user.accountState]}</TableBodyCell>
          <TableBodyCell>
            {#if user.accountState !== 2}
              <Button
                on:click={() => onChangeActivityStateOfUser(user)}
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
            {/if}
          </TableBodyCell>
          <TableBodyCell>
            <Button on:click={() => onChangeBanStateOfUser(user)}>
              {user.accountState === 0 || user.accountState === 1
                ? 'Ban'
                : 'Unban'}
            </Button>
          </TableBodyCell>
          <TableBodyCell>
            <Button on:click={() => onSaveUser(user)}>Save</Button>
          </TableBodyCell>
          <TableBodyCell>
            <Button on:click={() => onDeleteUser(user)}>Delete</Button>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{:else}
  <Spinner />
{/if}
