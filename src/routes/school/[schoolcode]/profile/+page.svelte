<script>
	import Card from "$components/Card.svelte";
	import { ws } from "$stores/wsStore";
</script>

<svelte:head>
	<title>PicoScratch Manager | Profil</title>
</svelte:head>

<Card>
	<h2 style="margin: 0; font-size: 1.9rem;">Allgemein</h2>
	<div style="display: flex; flex-direction: column;">
		<button on:click={() => {
			const newPw = prompt("Neues Passwort eingeben");
			if(!newPw) return;
			ws.send({ type: "changePassword", password: newPw })
		}}>Passwort ändern</button>
	</div>
</Card>