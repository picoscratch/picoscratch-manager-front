<script lang="ts">
	import "../styles.css";
	import "../background-blobs.css";
	import picoscratch_logo from "$lib/images/picoscratch-large.png";
	import { Turnstile } from "svelte-turnstile";
	import Spinner from "../Spinner.svelte";
    import { SERVER } from "../stores";

	let schoolname: string;
	let password: string;
	let cf_token: string;
	let code: string = "";
	let state: "form" | "loading" | "finished" = "form";
</script>

<svelte:head>
	<title>PicoScratch Demo registrieren</title>
	<meta name="description" content="Eine PicoScratch Demoversion registrieren um PicoScratch für Ihre Schule kostenlos auszuprobieren" />
</svelte:head>

<div style="display: flex; align-items: center; flex-direction: column;">
	<img src={picoscratch_logo} alt="PicoScratch Logo" width="400rem" style="margin: 20px; border-radius: 10px;" class="logo">
	{#if state == "form" || state == "loading"}
		<div class="forms">
			<div class="form">
				<h2>Wie heißt Ihre Schule?</h2>
				<span>Dies kann später NICHT geändert werden!</span>
				<input type="text" bind:value={schoolname} disabled={state == "loading"}>
			</div>
			<div class="form">
				<h2>Adminpasswort setzen</h2>
				<span>Dies kann später wieder geändert werden.</span>
				<input type="password" bind:value={password} disabled={state == "loading"}>
			</div>
			<div class="form">
				<h2>Sicherheitscheck!</h2>
				<Turnstile siteKey="0x4AAAAAAAIMlCCSCgEWr8BD" theme="dark" on:turnstile-callback={(e) => {
					cf_token = e.detail.token;
				}} class="ts" />
			</div>
			<div class="form">
				{#if state == "loading"}
					<h3 style="display: flex; justify-content: center; gap: 10px;">
						<Spinner />
						<span>Schule wird eingerichtet...</span>
					</h3>
				{:else}
					<button on:click={async () => {
						state = "loading";
						const res = await fetch(`${SERVER}makeSchool`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: JSON.stringify({
								schoolname,
								password,
								lang: "de",
								"cf-turnstile-response": cf_token
							})
						}).then(res => res.json());
						console.log(res);
						if(res.error) {
							state = "form";
							if(res.error == "Invalid captcha") {
								alert("Bitte lösen Sie den Sicherheitscheck!");
							} else {
								alert(res.error);
							}
							return;
						}
						if(!res.code) {
							alert("Es ist ein Fehler aufgetreten!");
							state = "form";
							return;
						}
						code = res.code;
						state = "finished";
					}}>Schule erstellen</button>
				{/if}
			</div>
		</div>
	{:else}
		<div style="display: flex; flex-direction: column; gap: 10px; align-items: center;" class="finished">
			<h2 style="margin: 0;">Willkommen bei PicoScratch!</h2>
			<span>Ihr Schulcode lautet <span class="code">{code}</span>, bitte schreiben Sie sich den Code auf.</span>
			<a href="../school/{code}">
				<button>Zum PicoScratch Manager</button>
			</a>
		</div>
	{/if}
</div>

<style>
	.forms {
		display: flex;
		flex-direction: column;
		gap: 30px;
		margin-top: 25px;
	}
	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}

	.form h2 {
		font-size: 2.5rem;
		margin: 0;
	}

	.form h3 {
		font-size: 2rem;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.form input {
		width: 100%;
		text-align: center;
	}

	.finished h2 {
		font-size: 2.5rem;
	}

	.finished span {
		font-size: 1.5rem;
		text-align: center;
	}

	@media (max-width: 500px) {
		.logo {
			width: 18rem;
		}

		.form h2 {
			font-size: 1.5rem;
		}
		
		.form span {
			font-size: 0.8rem;
		}
		
		.form h3 {
			flex-direction: column;
			font-size: 1rem;
		}

		.form h3 span {
			font-size: 1.4rem;
		}

		.form input {
			font-size: 1.6rem;
			width: 80%;
		}

		.finished h2 {
			font-size: 1.7rem;
		}

		.finished span {
			font-size: 1.4rem;
		}
	}

	.code {
		text-decoration: underline;
	}
</style>