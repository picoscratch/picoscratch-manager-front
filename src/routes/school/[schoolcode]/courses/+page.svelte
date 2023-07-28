<script>
  import Card from "../../../Card.svelte";
	import Add_Filled from "svelte-fluentui-icons/icons/Add_Filled.svelte";
	import ChangeName from "svelte-fluentui-icons/icons/Rename_Filled.svelte";
	import Delete from "svelte-fluentui-icons/icons/Delete_Filled.svelte";
	import { myProfile, schooldata } from "../../../stores";
    import { ws } from "../../../wsStore";
    import { get } from "svelte/store";
</script>

<div>
	{#each $schooldata.courses as course}
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem;">{course.name}</h2>
			{#if $myProfile.username.toLowerCase() == "admin"}
				<div style="margin-top: 5px; display: flex; justify-content: center;">
					<button on:click={() => {
						const newName = prompt("Neuer Kursname:");
						if(!newName) return;
						ws.send({ type: "renameCourse", uuid: course.uuid, name: newName })
						const sdata = get(schooldata);
						sdata.courses = sdata.courses.map((c) => {
							if(c.uuid == course.uuid) c.name = newName;
							return c;
						});
						schooldata.set(sdata);
					}}>
						<ChangeName size="40" />
					</button>
					<button on:click={() => {
						if(!confirm("Soll der Kurs wirklich gelöscht werden?")) return;
						ws.send({ type: "deleteTeacher", uuid: course.uuid })
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