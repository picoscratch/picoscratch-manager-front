<script lang="ts">
  import Card from "$components/Card.svelte";
	import Add_Filled from "svelte-fluentui-icons/icons/Add_Filled.svelte";
	import ChangeName from "svelte-fluentui-icons/icons/Rename_Filled.svelte";
	import Delete from "svelte-fluentui-icons/icons/Delete_Filled.svelte";
	import { myProfile, schooldata } from "$stores/stores";
	import { ws } from "$stores/wsStore";
	import PromptDialog from "$components/dialogs/PromptDialog.svelte";
  import Dialog from "$components/dialogs/Dialog.svelte";
	import ConfirmDialog from "$components/dialogs/ConfirmDialog.svelte";
  import CodeIcon from "svelte-fluentui-icons/icons/Code_Filled.svelte";
  import BeakerIcon from "svelte-fluentui-icons/icons/Beaker_Filled.svelte";
  import Selector from "$components/Selector.svelte";
  import SelectorButton from "$components/SelectorButton.svelte";

	let prompt: PromptDialog;
  let newCourseDialogShown = false;
	let confirm: ConfirmDialog;
  let newCourseNameInput: HTMLInputElement;
  let codingSelected = true;
  let chemistrySelected = false;

  function createNewCourse(name) {
    ws.send({type: "addCourse", name});
  }
</script>

<svelte:head>
	<title>PicoScratch Manager | Kurse</title>
</svelte:head>

<Dialog bind:showDialog={newCourseDialogShown}>
	<div style="display: flex; align-items: center; flex-direction: column; gap: 10px;">
		<h2 style="margin: 0; font-size: 2rem; text-align: center;">Neuen Kurs erstellen</h2>
		<input type="text" placeholder="Kursname" bind:this={newCourseNameInput} required on:keyup={(e) => {
			if(e.key === "Enter") {
        // Submit
        createNewCourse(newCourseNameInput.value);
        newCourseNameInput.value = "";
        newCourseDialogShown = false;
      }
		}}>
    <Selector>
      <SelectorButton bind:selected={codingSelected} on:click={() => {
        codingSelected = true;
        chemistrySelected = false;
      }}>
        <CodeIcon size="40" />
        Programmieren
      </SelectorButton>
      <SelectorButton bind:selected={chemistrySelected} on:click={() => {
        codingSelected = false;
        chemistrySelected = true;
      }}>
        <BeakerIcon size="40" />
        Chemie
      </SelectorButton>
    </Selector>
		<div style="display: flex; gap: 10px;">
			<button on:click={() => {
        createNewCourse(newCourseNameInput.value);
        newCourseNameInput.value = "";
        newCourseDialogShown = false;
      }}>OK</button>
			<button on:click={() => {
        newCourseNameInput.value = "";
        newCourseDialogShown = false;
      }}>Abbrechen</button>
		</div>
	</div>
</Dialog>
<PromptDialog bind:this={prompt} />
<ConfirmDialog bind:this={confirm} />



<div>
	{#each $schooldata.courses as course}
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem;">{course.name}</h2>
			{#if $myProfile.username.toLowerCase() == "admin"}
				<div style="margin-top: 5px; display: flex; justify-content: center;">
					<button on:click={async () => {
						const newName = await prompt.prompt("Kurs " + course.name + " umbennenen", { value: course.name, placeholder: "Kursname" });
						if(!newName) return;
						ws.send({ type: "renameCourse", uuid: course.uuid, name: newName })
					}}>
						<ChangeName size="40" />
					</button>
					<button on:click={async () => {
						if(!await confirm.confirm("Soll der Kurs wirklich gelöscht werden?")) return;
						ws.send({ type: "deleteCourse", uuid: course.uuid })
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
					// const name = await prompt.prompt("Neuen Kurs erstellen", { placeholder: "Kursname" });
					// if(!name) return;
					// ws.send({ type: "addCourse", name });
          codingSelected = true;
          chemistrySelected = false;
          newCourseDialogShown = true;
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
