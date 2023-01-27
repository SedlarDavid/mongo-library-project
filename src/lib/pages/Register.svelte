<script lang="ts">
  import { Button, Input, Label, Spinner } from 'flowbite-svelte';

  import * as Realm from 'realm-web';
  import { realmApp } from '../../main';
  import { Constants, MongoCollections } from '../../Constants';
  import { UserData, registerUserFormData } from '../models/UserData/UserData';

  const {
    BSON: { ObjectId },
  } = Realm;

  let isLoading = false;

  async function onSubmit(_e) {
    isLoading = true;
    await registerEmailPassword(
      $registerUserFormData.email,
      $registerUserFormData.password
    );
    //TODO redirect
  }

  async function registerEmailPassword(email, password) {
    try {
      await realmApp.emailPasswordAuth.registerUser({
        email,
        password,
      });
      await loginEmailPassword(email, password);
      console.log('Successfully logged in!');
      createUserData();
    } catch (err) {
      console.error('Failed to log in', err);
    }
  }

  //TODO on login ?
  async function loginEmailPassword(email, password) {
    // Create an email/password credential
    const credentials = Realm.Credentials.emailPassword(email, password);
    try {
      // Authenticate the user
      const user = await realmApp.logIn(credentials);
      // `App.currentUser` updates to match the logged in user
      console.assert(user.id === realmApp.currentUser.id);
      $registerUserFormData.personalId = user.id;
      return user;
    } catch (err) {
      console.error('Failed to log in', err);
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
</script>

<h1 class="text-black">Register</h1>
<div class="h-24" />
{#if !isLoading}
  <form on:submit|preventDefault={onSubmit}>
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
    <div class="mb-6">
      <Label for="password" class="mb-2 text-white">Password</Label>
      <Input
        type="password"
        id="password"
        placeholder="•••••••••"
        required
        bind:value={$registerUserFormData.password}
      />
    </div>
    <div class="mb-6">
      <Label for="confirm_password" class="mb-2 text-white"
        >Confirm password</Label
      >
      <Input
        type="password"
        id="confirm_password"
        placeholder="•••••••••"
        required
        bind:value={$registerUserFormData.passwordConfirm}
      />
    </div>
    <Button type="submit" color="yellow" on:click={onSubmit}>Submit</Button>
  </form>
{:else}
  <Spinner />
{/if}

<style></style>
