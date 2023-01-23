<script lang="ts">
  import { Router, Route, Link } from "svelte-navigator";

  import Register from "./lib/pages/Register.svelte";
  import Login from "./lib/pages/Login.svelte";
  import Administration from "./lib/pages/administration/Administration.svelte";
  import Books from "./lib/pages/Books.svelte";
</script>

<Router>
  <header>
    <nav>
      <Link to="/">Home</Link>
      <Link to="login">Login</Link>
      <Link to="register">Register</Link>
      <Link to="administration">Administration</Link>
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
  </main>
</Router>
