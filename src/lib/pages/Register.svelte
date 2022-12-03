<script lang="ts">
  import { Button, Input, Label, Spinner } from "flowbite-svelte";

  import { writable } from "svelte/store";
  import * as Realm from "realm-web";
  import { realmApp } from "../../main";

  let isLoading = false;

  export const formData = writable({
    name: "",
    surname: "",
    personalId: "",
    address: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  async function onSubmit(_e) {
    console.log($formData.name);

    await registerEmailPassword($formData.email, $formData.password);
  }

  async function registerEmailPassword(email, password) {
    try {
      await realmApp.emailPasswordAuth.registerUser({
        email,
        password,
      });
      // let user = await loginEmailPassword(email, password);
      // console.log("Successfully logged in!", user);
    } catch (err) {
      console.error("Failed to log in", err);
    }
  }

  // async function loginEmailPassword(email, password) {
  //   // Create an email/password credential
  //   const credentials = Realm.Credentials.emailPassword(email, password);
  //   try {
  //     // Authenticate the user
  //     const user = await realmApp.logIn(credentials);
  //     // `App.currentUser` updates to match the logged in user
  //     console.assert(user.id === realmApp.currentUser.id);
  //     return user;
  //   } catch (err) {
  //     console.error("Failed to log in", err);
  //   }
  // }
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
          placeholder="John"
          required
          bind:value={$formData.name}
        />
      </div>
      <div>
        <Label for="surname" class="mb-2 text-white">Surname</Label>
        <Input
          type="text"
          id="surname"
          placeholder="Doe"
          required
          bind:value={$formData.surname}
        />
      </div>
      <div>
        <Label for="personalId" class="mb-2 text-white">Personal ID</Label>
        <Input
          type="text"
          id="personalId"
          placeholder="981205/5578"
          required
          bind:value={$formData.personalId}
        />
      </div>
      <div>
        <Label for="address" class="mb-2 text-white">Address</Label>
        <Input
          type="text"
          id="address"
          placeholder="Na Stráni 553"
          required
          bind:value={$formData.address}
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
        bind:value={$formData.email}
      />
    </div>
    <div class="mb-6">
      <Label for="password" class="mb-2 text-white">Password</Label>
      <Input
        type="password"
        id="password"
        placeholder="•••••••••"
        required
        bind:value={$formData.password}
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
        bind:value={$formData.passwordConfirm}
      />
    </div>
    <Button type="submit" color="yellow" on:click={onSubmit}>Submit</Button>
  </form>
{:else}
  <Spinner />
{/if}

<style></style>
