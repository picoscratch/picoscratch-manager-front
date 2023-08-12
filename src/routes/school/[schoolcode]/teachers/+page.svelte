<script lang="ts">
  import Card from "$components/Card.svelte";
  import Profile from "$components/Profile.svelte";
	import Add_Filled from "svelte-fluentui-icons/icons/Add_Filled.svelte";
	import ChangePassword from "svelte-fluentui-icons/icons/Password_Filled.svelte";
	import Delete from "svelte-fluentui-icons/icons/Delete_Filled.svelte";
	import { myProfile, schooldata } from "$stores/stores";
	import { ws } from "$stores/wsStore";
	import PromptDialog from "$components/dialogs/PromptDialog.svelte";
	import ConfirmDialog from "$components/dialogs/ConfirmDialog.svelte";
	import DoublePromptDialog from "$components/dialogs/DoublePromptDialog.svelte";

	let prompt: PromptDialog;
	let prompt2: DoublePromptDialog;
	let confirm: ConfirmDialog;

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

<svelte:head>
	<title>PicoScratch Manager | Lehrer</title>
</svelte:head>

<PromptDialog bind:this={prompt} />
<DoublePromptDialog bind:this={prompt2} />
<ConfirmDialog bind:this={confirm} />

<div>
	{#each $schooldata.teachers as teacher}
		<Card>
			<Profile username={teacher.name} />
			{#if $myProfile.username.toLowerCase() == "admin"}
				<div style="margin-top: 5px; display: flex; justify-content: center;">
					<button on:click={async () => {
						const newPw = await prompt.prompt("Passwort für " + teacher.name + " ändern", { placeholder: "Passwort", type: "password" });
						if(!newPw) return;
						ws.send({ type: "changeTeacherPassword", uuid: teacher.uuid, password: newPw })
					}}>
						<ChangePassword size="40" />
					</button>
					<button on:click={async () => {
						if(!await confirm.confirm("Soll der Lehrer wirklich gelöscht werden?", { subtext: "Dies kann nicht rückgängig gemacht werden!" })) return;
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
				<button on:click={async () => {
					const newTeacher = await prompt2.prompt("Neuen Lehrer hinzufügen", { placeholder1: "Name", placeholder2: "Passwort", type2: "password" });
					if(!newTeacher) return;
					ws.send({ type: "addTeacher", username: newTeacher[0], password: newTeacher[1] })
				}}>
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