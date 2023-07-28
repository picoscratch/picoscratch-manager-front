<script lang="ts">
  import Card from "../../../Card.svelte";
	import Add_Filled from "svelte-fluentui-icons/icons/Add_Filled.svelte";
	import Delete from "svelte-fluentui-icons/icons/Delete_Filled.svelte";
	import { myProfile, schooldata } from "../../../stores";
	import { ws } from "../../../wsStore";

	function selectChange(e: Event, room: any) {
		if(!e.target) return;
		const target = e.target as HTMLSelectElement;
		const newId = target.value;
		ws.send({
			type: "setActiveCourse",
			uuid: room.uuid,
			course: newId
		});
	}
</script>

<div>
	{#each $schooldata.rooms as room}
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem;">{room.name}</h2>
			<select on:change={(e) => {
				selectChange(e, room);
			}} value={room.courseUuid}>
				<option value="nocourse">Kein Kurs</option>
				{#each $schooldata.courses as course}
					<option value={course.uuid}>{course.name}</option>
				{/each}
			</select>
			{#if $myProfile.username.toLowerCase() == "admin"}
				<div style="margin-top: 5px; display: flex; justify-content: center;">
					<button on:click={() => {
						if(!confirm("Soll der Lehrer wirklich gelöscht werden?")) return;
						ws.send({ type: "deleteRoom", uuid: room.uuid })
					}}>
						<Delete size="40" color="#A03030" />
					</button>
				</div>
			{/if}
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