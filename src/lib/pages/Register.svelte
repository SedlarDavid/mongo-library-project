<script>
  import { Button, Input, Label } from "flowbite-svelte";
</script>

<h1>Register</h1>
<div class="h-24"/>
<form>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="name" class="mb-2 text-white">Name</Label>
      <Input type="text" id="name" placeholder="John" required />
    </div>
    <div>
      <Label for="surname" class="mb-2 text-white">Surname</Label>
      <Input type="text" id="surname" placeholder="Doe" required />
    </div>
    <div>
      <Label for="personalId" class="mb-2 text-white">Personal ID</Label>
      <Input type="text" id="personalId" placeholder="981205/5578" required />
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
  <div class="mb-6">
    <Label for="password" class="mb-2 text-white">Password</Label>
    <Input type="password" id="password" placeholder="•••••••••" required />
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
    />
  </div>
  <Button type="submit" color="yellow">Submit</Button>
</form>

<style></style>
