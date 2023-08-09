<script>
	import logo from '$lib/images/picoscratch-large.png';
  import NavIcon from "svelte-fluentui-icons/icons/Navigation_Filled.svelte";
	import Profile from './Profile.svelte';
	import { myProfile, navPosition, schooldata } from './stores';
	import { capFirstLetter } from './utils';
</script>

<header>
	<div class="corner" style="display: flex; gap: 10px;">
		{#if window.innerWidth < 900}
			<button on:click={async () => {
				if($navPosition == "open") {
					navPosition.set("closing");
					await new Promise(r => setTimeout(r, 800));
					navPosition.set("closed");
				} else {
					navPosition.set("open");
				}
			}}>
				<NavIcon size=40 />
			</button>
		{/if}
		<a data-sveltekit-reload href="https://server.picoscratch.de/manager?schoolcode={$schooldata.code}" target="_blank">
			<img src={logo} alt="PicoScratch" />
		</a>
	</div>

	<div id="user">
		<Profile username={capFirstLetter($myProfile.username.toLowerCase())} smallText />
		<h3>{$myProfile.username.toLowerCase() == "admin" ? "Admin" : "Lehrer"}</h3>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	#user {
		text-align: right;
		margin: 5px;
	}

	#user h3 {
		margin-top: 10px;
		margin: 0;
	}

	.corner {
		width: 3em;
		height: 3em;
		margin: 5px;
	}

	.corner img {
		width: 14em;
		border-radius: 10px;
		object-fit: contain;
	}
</style>
