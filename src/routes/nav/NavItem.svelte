<script>
	import arrowPic from "$lib/images/arrow.svg";
	import { page } from "$app/stores";
	export let text = "";
	export let arrow = false;
	export let url = "";
	export let prefetch = true;
	let active = false;

	$:  {
		if($page.url.pathname.endsWith(url)) {
			active = true;
		} else {
			active = false;
		}
	}
</script>

<!-- {#if active}
	<h3 class="active">{text}</h3>
{:else}
	<h3>{text}</h3>
{/if} -->

<a href={"/school/" + $page.params.schoolcode + "/" + url} data-sveltekit-preload-data={prefetch ? "hover" : "tap"}>
	<h3 class={active ? "active" : ""}>
		{#if arrow}
			<img src={arrowPic} alt="->" />
		{/if}
		{text}
	</h3>
</a>

<style>
	a {
		text-decoration: none;
		color: white;
		cursor: default;
	}

	h3 {
		margin: 0;
		margin-bottom: 5px;
		font-size: 1.4rem;
		padding: 5px;
		border-radius: 5px;
	}

	.active {
		background-color: #40C340;
	}
</style>