<script lang="ts">
    import { Button, Input, Label, Spinner } from "flowbite-svelte";
  
    import { writable } from "svelte/store";
    import * as Realm from "realm-web";
    import { realmApp } from "../../main";
  
    let isLoading = false;
  
    export const formData = writable({
      email: "",
      password: ""
    });
  
    async function onSubmit(_e) {
      console.log($formData.email);

      await loginEmailPassword($formData.email, $formData.password);
    }

    export async function loginEmailPassword(email, password) {
    // Create an email/password credential
    const credentials = Realm.Credentials.emailPassword(email, password);
    try {
      // Authenticate the user
      const user = await realmApp.logIn(credentials);
      // `App.currentUser` updates to match the logged in user
      console.assert(user.id === realmApp.currentUser.id);
      return user;
    } catch (err) {
      console.error("Failed to log in", err);
    }
  }
  </script>
  
  <h1>Login page</h1>
  <div class="h-24" />
  {#if !isLoading}
    <form on:submit|preventDefault={onSubmit}>
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
      <Button type="submit" color="yellow" on:click={onSubmit}>Submit</Button>
    </form>
  {:else}
    <Spinner />
  {/if}
  
  <style></style>