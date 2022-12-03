<script lang="ts">
  import { Router, Route, Link } from "svelte-navigator";

  import Register from "./lib/pages/Register.svelte";
  import Login from "./lib/pages/Login.svelte";
</script>

<Router>
  <header>
    <nav>
      <Link to="/">Home</Link>
      <Link to="login">Login</Link>
      <Link to="register">Register</Link>
    </nav>
  </header>

  <main>
    <Route path="login">
      <Login />
    </Route>
    <Route path="register">
      <Register />
    </Route>
  </main>
</Router>
