<script>
	import Header from '$routes/Header.svelte';
  import Nav from "$components/nav/Nav.svelte";
	import '$routes/styles.css';
	import { page } from '$app/stores';
	import { loggedIn as _loggedIn } from "$stores/stores";
  import { onDestroy, onMount } from "svelte";
  import Login from '$routes/Login.svelte';
	import { onNavigate } from '$app/navigation';

  let loggedIn = false;

  const unsubscribe = _loggedIn.subscribe((value) => {
    loggedIn = value;
  });

  onDestroy(() => {
    unsubscribe();
  });

	let path = "/";

	$: {
		path = $page.url.pathname;
	}

	onMount(() => {
		if(path == "/" && loggedIn) {
			_loggedIn.set(false);
		}
	})

	onNavigate((navigation) => {
		if(!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex">
</svelte:head>

<div class="app">
	{#if loggedIn}
		<Header />
	{/if}

  <div class="content">
		{#if loggedIn}
			<Nav>
			</Nav>
		{/if}
    
	  <main>
			{#if !loggedIn && path != "/"}
				<Login />
			{:else}
		  	<slot />
			{/if}
	  </main>
  </div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		/* flex: 1; */
		display: flex;
		flex-direction: column;
		padding-left: 1rem;
		width: 100%;
		/* max-width: 64rem; */
		margin: 0 auto;
		box-sizing: border-box;
		height: 90vh;
		overflow-y: scroll;
		view-transition-name: content;
	}

  .content {
    display: flex;
  }

	@media(max-width: 900px) {
		main {
			padding-left: 0;
			margin: 5px;
		}
	}
</style>
