<script lang="ts">
  import Card from "../../../Card.svelte";
  import Profile from "../../../Profile.svelte";
	import Add_Filled from "svelte-fluentui-icons/icons/Add_Filled.svelte";
	import ChangePassword from "svelte-fluentui-icons/icons/Password_Filled.svelte";
	import Delete from "svelte-fluentui-icons/icons/Delete_Filled.svelte";
	import { myProfile, schooldata } from "../../../stores";
	import { ws } from "../../../wsStore";

	$: {
		const packet = $ws as any;
		console.log(packet)
		if(packet.type == "deleteTeacher") {
			if(packet.error) {
				alert("Error deleting teacher: " + packet.error);
			}
		}
	}
</script>

<div>
	{#each $schooldata.teachers as teacher}
		<Card>
			<Profile username={teacher.name} />
			{#if $myProfile.username.toLowerCase() == "admin"}
				<div style="margin-top: 5px; display: flex; justify-content: center;">
					<button on:click={() => {
						const newPw = prompt("Neues Passwort:");
						if(!newPw) return;
						ws.send({ type: "changeTeacherPassword", uuid: teacher.uuid, password: newPw })
					}}>
						<ChangePassword size="40" />
					</button>
					<button on:click={() => {
						if(!confirm("Soll der Lehrer wirklich gelöscht werden?")) return;
						ws.send({ type: "deleteTeacher", uuid: teacher.uuid })
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