<script lang="ts">
	export let username = "";
	export let status: null | "online" | "idle" | "offline" = null;
	export let smallText = false;
</script>

<h2>
	<!-- we dont want to blow up phones -->
	{#if window.innerWidth > window.innerHeight}
		<img src="https://avatar.picoscratch.de/?seed={username}" id="user-profile" width="35px" height="35px" alt="">
	{/if}
	{#if status != null}
		{#if status == "online"}
			<div class="statusicon status-online"></div>
		{:else if status == "idle"}
			<div class="statusicon status-idle"></div>
		{:else if status == "offline"}
			<div class="statusicon status-offline"></div>
		{/if}
	{/if}
	<span id="username" class={smallText ? "small" : ""}>{username}</span>
</h2>

<style>
	h2 {
		display: flex;
		gap: 5px;
		align-items: center;
		/* margin: 5px; */
		/* margin-bottom: 0; */
		margin: 0;
	}
	h2 img {
		border-radius: 100%;
	}

	.statusicon {
		border-radius: 100%;
		width: 20px;
		height: 20px;
	}

	.status-online {
		background-color: #40C340;
	}

	.status-idle {
		background-color: #F5F550;
	}

	.status-offline {
		background-color: #C34040;
	}

	span:not(.small) {
		font-size: 1.9rem;
	}
</style>
