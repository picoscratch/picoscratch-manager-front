<script>
	import logo from '$lib/images/picoscratch-large.png';
	import Profile from './Profile.svelte';
	import { myProfile, schooldata } from './stores';
	import { capFirstLetter } from './utils';
</script>

<header>
	<div class="corner">
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
	}

	.corner img {
		width: 15em;
		margin: 5px;
		border-radius: 10px;
		object-fit: contain;
	}
</style>
