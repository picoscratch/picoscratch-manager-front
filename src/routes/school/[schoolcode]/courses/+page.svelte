<script>
  import Card from "../../../Card.svelte";
	import Add_Filled from "svelte-fluentui-icons/icons/Add_Filled.svelte";
	import { myProfile, schooldata } from "../../../stores";
</script>

<div>
	{#each $schooldata.courses as course}
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem;">{course.name}</h2>
		</Card>
	{/each}
	<!-- <Card>
		<Profile username="Admin" />
	</Card>
	<Card>
		<Profile username="Admin" />
	</Card> -->
	{#if $myProfile.username.toLowerCase() == "admin"}
		<Card>
			<div style="display: flex; align-items: center; justify-content: center; height: 100%;">
				<button on:click={() => alert("Noch nicht implementiert, bitte alten PSM nutzen.")}>
					<Add_Filled size="40" />
				</button>
			</div>
		</Card>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		gap: 10px;
		flex-wrap: wrap;
	}

	@media(max-width: 900px) {
		div {
			flex-direction: column;
		}
		div > :global(div) {
			width: calc(100% - 25px);
		}
	}
</style>