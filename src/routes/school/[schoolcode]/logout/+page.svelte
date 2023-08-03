<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation"
	
	onMount(() => {
		localStorage.removeItem("schoolcode");
		localStorage.removeItem("username");
		goto("/");
	})
</script>

Logging out...