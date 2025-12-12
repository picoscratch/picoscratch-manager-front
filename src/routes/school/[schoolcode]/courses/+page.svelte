<script lang="ts">
  import Card from "$components/Card.svelte";
	import Add_Filled from "svelte-fluentui-icons/icons/Add_Filled.svelte";
	import ChangeName from "svelte-fluentui-icons/icons/Rename_Filled.svelte";
	import Delete from "svelte-fluentui-icons/icons/Delete_Filled.svelte";
	import { myProfile, schooldata } from "$stores/stores";
	import { ws } from "$stores/wsStore";
	import PromptDialog from "$components/dialogs/PromptDialog.svelte";
	import ConfirmDialog from "$components/dialogs/ConfirmDialog.svelte";
    import { m } from "../../../../paraglide/messages";

	let prompt: PromptDialog;
	let confirm: ConfirmDialog;
</script>

<svelte:head>
		<title>PicoScratch Manager | {m.nav_courses()}</title>
</svelte:head>

<PromptDialog bind:this={prompt} />
<ConfirmDialog bind:this={confirm} />

<div>
	{#each $schooldata.courses as course}
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem;">{course.name}</h2>
			{#if $myProfile.username.toLowerCase() == "admin"}
				<div style="margin-top: 5px; display: flex; justify-content: center;">
					<button on:click={async () => {
						const newName = await prompt.prompt(m.course_rename({ course: course.name }), { value: course.name, placeholder: m.coursename() });
						if(!newName) return;
						ws.send({ type: "renameCourse", uuid: course.uuid, name: newName })
					}}>
						<ChangeName size="40" />
					</button>
					<button on:click={async () => {
						if(!await confirm.confirm(m.course_delete_confirm({ course: course.name }), { subtext: m.course_delete_confirm_subtext() })) return;
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
					const name = await prompt.prompt(m.course_new(), { placeholder: m.coursename() });
					if(!name) return;
					ws.send({ type: "addCourse", name });

					// @ts-expect-error not typed yet
					if(window.rybbit) {
						// @ts-expect-error not typed yet
						window.rybbit.event("add_course", {
							school: $schooldata.name,
							course: name
						});
					}
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