<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation"
	
	onMount(() => {
		localStorage.removeItem("schoolcode");
		localStorage.removeItem("username");
		localStorage.removeItem("password");
		goto("/");
	})
</script>

Logging out...