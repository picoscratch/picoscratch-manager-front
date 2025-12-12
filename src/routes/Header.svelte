<script>
	import logo from '$lib/images/picoscratch-large.png';
  import NavIcon from "svelte-fluentui-icons/icons/Navigation_Filled.svelte";
	import Profile from '$components/Profile.svelte';
	import { myProfile, navPosition, schooldata } from '$stores/stores';
	import { capFirstLetter } from './utils';
    import { m } from '../paraglide/messages';
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
		<img src={logo} alt="PicoScratch" />
	</div>

	<div id="user">
		<Profile username={capFirstLetter($myProfile.username.toLowerCase())} smallText />
		<h3>{$myProfile.username.toLowerCase() == "admin" ? m.admin() : m.teacher()}</h3>
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
		height: 3.5em;
		margin: 5px;
	}

	.corner img {
		width: 12em;
		border-radius: 10px;
		object-fit: contain;
	}
</style>
