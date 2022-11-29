<script lang="ts">
  let count: number = 0
  const increment = () => {
    count += 1
  }

	import { Alert } from 'flowbite-svelte';
</script>

<div class="p-8">
	<Alert>
		<span class="font-medium">Info alert!</span> Change a few things up and try submitting again.
	</Alert>
</div>

<button on:click={increment}>
  count is {count}
</button>
