<script>
	import Card from "$components/Card.svelte";
	import { ws } from "$stores/wsStore";
    import { m } from "../../../../paraglide/messages";
</script>

<svelte:head>
	<title>PicoScratch Manager | {m.nav_profile()}</title>
</svelte:head>

<Card>
	<h2 style="margin: 0; font-size: 1.9rem;">{m.general()}</h2>
	<div style="display: flex; flex-direction: column;">
		<button on:click={() => {
			const newPw = prompt(m.profile_change_password());
			if(!newPw) return;
			ws.send({ type: "changePassword", password: newPw })
		}}>{m.profile_change_password()}</button>
	</div>
</Card>