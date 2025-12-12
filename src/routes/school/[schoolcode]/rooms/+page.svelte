<script lang="ts">
  import Card from "$components/Card.svelte";
	import Add_Filled from "svelte-fluentui-icons/icons/Add_Filled.svelte";
	import Delete from "svelte-fluentui-icons/icons/Delete_Filled.svelte";
	import { myProfile, schooldata } from "$stores/stores";
	import { ws } from "$stores/wsStore";
	import PromptDialog from "$components/dialogs/PromptDialog.svelte";
	import ConfirmDialog from "$components/dialogs/ConfirmDialog.svelte";
	import { get } from "svelte/store";
    import { m } from "../../../../paraglide/messages";

	let prompt: PromptDialog;
	let confirm: ConfirmDialog;

	function selectChange(e: Event, room: any) {
		if(!e.target) return;
		const target = e.target as HTMLSelectElement;
		const newId = target.value;
		ws.send({
			type: "setActiveCourse",
			uuid: room.uuid,
			course: newId
		});
		const sdata = get(schooldata);
		sdata.rooms = sdata.rooms.map((r) => {
			if(r.uuid == room.uuid) r.courseUuid = newId;
			return r;	
		});
		schooldata.set(sdata);
	}
</script>

<svelte:head>
	<title>PicoScratch Manager | {m.nav_rooms()}</title>
</svelte:head>

<PromptDialog bind:this={prompt} />
<ConfirmDialog bind:this={confirm} />

<div>
	{#each $schooldata.rooms as room}
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem;">{room.name}</h2>
			<select on:change={(e) => {
				selectChange(e, room);
			}} value={room.courseUuid || "nocourse"}>
				<option value="nocourse">{m.no_course()}</option>
				{#each $schooldata.courses as course}
					<option value={course.uuid}>{course.name}</option>
				{/each}
			</select>
			{#if $myProfile.username.toLowerCase() == "admin"}
				<div style="margin-top: 5px; display: flex; justify-content: center;">
					<button on:click={async () => {
						if(!await confirm.confirm(m.room_delete_confirm({ room: room.name }), { subtext: m.room_delete_confirm_subtext() })) return;
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
				<button on:click={async () => {
					const newRoom = await prompt.prompt(m.room_new(), { placeholder: m.room_new_placeholder() });
					if(!newRoom) return;
					ws.send({ type: "addRoom", name: newRoom });

					// @ts-expect-error not typed yet
					if(window.rybbit) {
						// @ts-expect-error not typed yet
						window.rybbit.event("add_room", {
							school: $schooldata.name,
							room: newRoom
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