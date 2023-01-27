<script lang="ts">
  import { Router, Route, Link } from 'svelte-navigator';

  import Register from './lib/pages/Register.svelte';
  import Login from './lib/pages/Login.svelte';
  import Administration from './lib/pages/administration/Administration.svelte';
  import Books from './lib/pages/Books.svelte';
  import Profile from './lib/pages/Profile.svelte';
  import { Button } from 'flowbite-svelte';
  import { realmApp } from './main';

  async function onLogout() {
    await realmApp.currentUser.logOut();
    location.reload();
  }
</script>

<Router>
  <header>
    <nav>
      <Link to="/">Home</Link>
      <Link to="login">Login</Link>
      <Link to="register">Register</Link>
      <Link to="administration">Administration</Link>
      <Link to="profile">Profile</Link>
      {#if realmApp.currentUser != null}
        <Button on:click={() => onLogout()}>Logout</Button>
      {/if}
    </nav>
  </header>

  <main>
    <Route path="/">
      <Books />
    </Route>
    <Route path="login">
      <Login />
    </Route>
    <Route path="register">
      <Register />
    </Route>
    <Route path="administration">
      <Administration />
    </Route>
    <Route path="profile">
      <Profile />
    </Route>
  </main>
</Router>
