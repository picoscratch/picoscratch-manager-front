<script lang="ts" type="module">
	import { onDestroy, onMount } from "svelte";
	import { SERVER, schooldata as _schooldata, loggedIn, myProfile } from "./stores";
	import { ws as _ws } from "./wsStore";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation"
	
	let ws: any;
	let loading = true;
	let schooldata: { name: string, uuid: string, lang: string } | null;
	let schoolcode = $page.params.schoolcode;
	$: console.log(schoolcode);
	$: {
		console.log(ws);
	}

  const unsubWS = _ws.subscribe((value) => {ws = value as WebSocket;});
  const unsubSchoolData = _schooldata.subscribe((value) => {schooldata = value;});

  onDestroy(() => {
    unsubWS();
		unsubSchoolData();
  });

	let username = "";
	let password = "";

	function login() {
		if(ws == null) return;
		_ws.send({ type: "hi", clientType: "teacher", schoolCode: schoolcode, username, password });
	}

	onMount(() => {
		if(schooldata == null) {
			fetch(SERVER + "schoolcode/" + schoolcode).then(res => res.json()).then(data => {
				_schooldata.set(data);
			}).catch(err => {
				console.error(err);
			});
		}
		loading = false;

		const lsusername = localStorage.getItem("username");
		const lspassword = localStorage.getItem("password");
		if(lsusername && lspassword) {
			username = lsusername;
			password = lspassword;
			loading = true;
			setTimeout(() => {
				login();
				loading = false;
			}, 500);
		}
	})

	function switchSchool() {
		localStorage.removeItem("schoolcode");
		localStorage.removeItem("username");
		localStorage.removeItem("password");
		goto("/");
	}

	$: (() => {
		if(!(ws.type == "hi")) return;
		if(ws.success == false) {
			username = "";
			password = "";
			ws = {};
			return;
		}
		_schooldata.set(ws.school);
		loggedIn.set(true);
		myProfile.set({
			username
		});
		localStorage.setItem("username", username);
		localStorage.setItem("password", password);
	})()
</script>
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="content">
	<h1>PicoScratch Manager</h1>
	{#if schooldata == undefined || ws == undefined || loading}
		<p>loading...</p>
	{:else}
		<h2>{schooldata.name}</h2>
		<input type="text" id="username" contenteditable placeholder="Benutzername" bind:value={username} style="margin-bottom: 5px;">
		<input type="password" id="password" contenteditable placeholder="Passwort" bind:value={password}>
		<div>
			<button on:click={login}>Login</button>
			<button on:click={switchSchool}>Switch school</button>
		</div>
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

	button {
		margin-top: 10px;
	}
</style>