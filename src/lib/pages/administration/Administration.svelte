<script lang="ts">
  import { Button, Input, Label, Spinner } from 'flowbite-svelte';

  import * as Realm from 'realm-web';
  import { realmApp } from '../../../main';
  import { Constants, MongoCollections } from '../../../Constants';
  import { onMount } from 'svelte';
  import {
    registerUserFormData,
    UserData,
  } from '../../models/UserData/UserData';
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
  import Login from '../Login.svelte';

  const mongo = realmApp.currentUser
    .mongoClient(import.meta.env.VITE_DATA_SOURCE_NAME)
    .db(Constants.DatabaseName);

  let isLoading = true;
  const {
    BSON: { ObjectId },
  } = Realm;

  onMount(async () => {
    await getCurrentUserInfo();
    await getUsers();
  });

  var currentUser: UserData;
  var users = new Array<UserData>();
  var searchedUser = new UserData(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    0,
    [],
    1
  );
  let isFormOpen = false;
  let canSeePage = false;

  async function registerEmailPassword(email, password) {
    try {
      await realmApp.emailPasswordAuth.registerUser({
        email,
        password,
      });

      for (const userId in realmApp.allUsers) {
        const user = realmApp.allUsers[userId];
        if (user.profile.email === email) {
          $registerUserFormData.personalId = userId;
          console.log(userId);
        }
      }

      createUserData();
    } catch (err) {
      console.error('Failed to create user', err);
    }
  }

  async function createUserData() {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );
    const users = mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users);

    const result = await users.insertOne(
      UserData.fromFormData($registerUserFormData)
    );
  }

  async function getCurrentUserInfo() {
    const data = mongo.collection(MongoCollections.Users);
    const result = (await data.find()) as UserData[];
    currentUser = result.find(
      (user) => user.personalId === realmApp.currentUser.id
    );
    if (currentUser != null) {
      if (currentUser.role === 1) canSeePage = false;
      else canSeePage = true;
    }
  }

  async function getSearchedUsers(user: UserData) {
    const searchQuery = {
      $or: [
        { name: { $regex: `.*${user.name}.*`, $options: 'i' } },
        { surname: { $regex: `.*${user.surname}.*`, $options: 'i' } },
        { address: { $regex: `.*${user.address}.*`, $options: 'i' } },
        {
          nationalIdNumber: {
            $regex: `.*${user.nationalIdNumber}.*`,
            $options: 'i',
          },
        },
      ],
    };

    const data = mongo.collection(MongoCollections.Users);
    const result = (await data.find(searchQuery)) as UserData[];
    users = result;
  }

  async function getUsers() {
    const data = mongo.collection(MongoCollections.Users);
    const result = (await data.find()) as UserData[];
    users = result;
    isLoading = false;
  }

  async function OnUsersSearch() {
    getSearchedUsers(searchedUser);
    isLoading = false;
  }

  async function OnReset() {
    await getUsers();
    isLoading = false;
  }

  async function download() {
    const users = mongo.collection(MongoCollections.Users);
    var result = await users.find();
    const data = JSON.stringify(result);

    var a = document.createElement('a');
    var file = new Blob([data], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'users.txt';
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
            address: user.address,
            role: user.role,
          },
        }
      );
    await getUsers();
  }

  async function onDeleteUser(user: UserData) {
    const mongo = realmApp.currentUser.mongoClient(
      import.meta.env.VITE_DATA_SOURCE_NAME
    );

    const data = await mongo
      .db(Constants.DatabaseName)
      .collection(MongoCollections.Users)
      .deleteOne({ personalId: user.personalId });
    await getUsers();
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
    await getUsers();
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
    await getUsers();
  }

  function generateRandomString(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  async function onSubmit(_e) {
    isLoading = true;
    var password = generateRandomString(10);
    await registerEmailPassword($registerUserFormData.email, password);
    await getUsers();
  }

  var jsonData;
  function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const contents = event.target.result;
      // do something with the contents
      console.log(contents);
      jsonData = JSON.parse(contents as string);

      (jsonData as Array<object>).forEach((obj) =>
        mongo.collection(MongoCollections.Users).insertOne(obj)
      );
    };
    reader.readAsText(file);
  }
</script>

<div class="flex flex-row justify-between">
  <h1 class="text-black">Administration</h1>
  <div>
    <Label for="import">Upload file to import:</Label>
    <input type="file" on:change={handleFile} />
  </div>
</div>
<div class="h-12" />
{#if canSeePage}
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
        <Input
          type="text"
          id="name"
          placeholder="Name"
          required
          bind:value={$registerUserFormData.name}
        />
      </div>
      <div>
        <Label for="surname" class="mb-2 text-white">Surname</Label>
        <Input
          type="text"
          id="surname"
          placeholder="Doe"
          required
          bind:value={$registerUserFormData.surname}
        />
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
          bind:value={$registerUserFormData.nationalIdNumber}
        />
      </div>
      <div>
        <Label for="address" class="mb-2 text-white">Address</Label>
        <Input
          type="text"
          id="address"
          placeholder="Na Stráni 553"
          required
          bind:value={$registerUserFormData.address}
        />
      </div>
    </div>
    <div class="mb-6">
      <Label for="email" class="mb-2 text-white">Email address</Label>
      <Input
        type="email"
        id="email"
        placeholder="john.doe@company.com"
        required
        bind:value={$registerUserFormData.email}
      />
    </div>
    <Button type="submit" color="yellow" on:click={onSubmit}>Submit</Button>
  </form>

  <Button on:click={() => download()}>Export users</Button>

  <div class="flex flex-row justify-between">
    <h1 class="text-black">Users</h1>
  </div>
  <div class="h-18" />
  <div>
    <div class="flex flex-row justify-between" />
    <Input
      minlength="3"
      bind:value={searchedUser.name}
      type="text"
      id="name"
      placeholder="John..."
    />
    <Input
      minlength="3"
      bind:value={searchedUser.surname}
      type="text"
      id="surname"
      placeholder="Wick..."
    />
    <Input
      minlength="3"
      bind:value={searchedUser.address}
      type="text"
      id="address"
      placeholder="Nad Stráněmi 553..."
    />
    <Input
      minlength="3"
      bind:value={searchedUser.nationalIdNumber}
      type="text"
      id="nationalIdNumber"
      placeholder="115115115/7415"
    />
    <Button on:click={() => OnUsersSearch()}>Search</Button>
    <Button on:click={() => OnReset()}>Reset</Button>
  </div>
  {#if !isLoading}
    <Table>
      <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Surname</TableHeadCell>
        <TableHeadCell>National ID Number</TableHeadCell>
        <TableHeadCell>Nickname</TableHeadCell>
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
{:else}
  <p style="color: red;">You are not authorized to see this page!</p>
{/if}
