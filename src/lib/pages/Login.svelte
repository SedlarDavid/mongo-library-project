<script lang="ts">
    import { Button, Input, Label, Spinner } from "flowbite-svelte";
  
    import { writable } from "svelte/store";
    import * as Realm from "realm-web";
  
    let isLoading = false;
  
    export const formData = writable({
      email: "",
      password: ""
    });
  
    function onSubmit(_e) {
      console.log($formData.email);
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