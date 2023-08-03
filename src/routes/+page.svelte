<script lang="ts">
	import './styles.css';
	import "./background-blobs.css";
	import { onMount } from "svelte";
	import { SERVER, schooldata } from "./stores";

	let code = "";
	// let loading = true;
	// let error = false;
	let state: "loading" | "error" | "ready" = "loading";

	async function login() {
		if(code.length == 7) {
			// loading = true;
			state = "loading";
			let _schooldata = await fetch(SERVER + "schoolcode/feshges").then(res => res.json()).catch(err => {
				// error = true;
				state = "error";
				console.error(err);
			});
			if(!_schooldata) return;
			// schooldata.update(() => _schooldata);
			localStorage.setItem("schoolcode", code);
			window.location.href = "/school/" + code;
		}
	}

	onMount(() => {
		// loading = false;
		state = "ready";

		const lscode = localStorage.getItem("schoolcode");
		if(lscode) {
			console.log("found school code in local storage");
			code = lscode;
			login();
		}
	});
</script>
<svelte:head>
	<title>PicoScratch Manager, das Lehrerportal von PicoScratch.</title>
	<meta name="description" content="Der PicoScratch Manager ermöglicht Lehrer, die Kurse ihrer Schule zu verwalten." />
</svelte:head>

<div class="content">
	<h1>PicoScratch Manager</h1>
	{#if state == "loading"}
		<p>loading...</p>
	{:else if state == "error"}
		<p>Error! Please try again later.</p>
	{:else}
		<h2>School code</h2>
		<input type="text" id="code" maxlength="7" contenteditable bind:value={code} on:keyup={(e) => {
			if(e.key == "Enter") login();
		}}>
		<button on:click={login} class="btn-primary">Login</button>
		<button on:click={() => location.href = "/register"}>Register free demo</button>
	{/if}
</div>

<style>
	.content {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		flex-direction: column;
	}

	h1 {
		margin: 0;
	}

	h2 {
		margin: 5px;
	}

	#code {
		width: 7ch;
	}

	button {
		margin-top: 10px;
	}
</style>