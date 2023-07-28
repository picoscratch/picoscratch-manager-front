<script lang="ts">
	import { page } from "$app/stores";
	import Card from "../../../../Card.svelte";
	import Profile from "../../../../Profile.svelte";
	import PersonKick from "svelte-fluentui-icons/icons/PersonArrowRight_Filled.svelte";
	import PersonDelete from "svelte-fluentui-icons/icons/Delete_Filled.svelte";
	import PersonVerify from "svelte-fluentui-icons/icons/Checkmark_Filled.svelte";
	import { ws } from "../../../../wsStore";
	import { schooldata } from "../../../../stores";

	let absentsShown = false;
	const courseUUID = $page.params.course;
	const coursedata = $schooldata.courses.find((c: {uuid: string}) => c.uuid == courseUUID);
	let leaderboard: [{level: number, name: string, percentage: number, status: "offline" | "idle" | "online", uuid: string}];

	$: {
		console.log($ws);
		const data = $ws as any;
		if(data.type == "getCourseInfo") {
			leaderboard = data.leaderboard;
		} else if(data.type == "leaderboard") {
			if(data.course.uuid == courseUUID) leaderboard = data.leaderboard;
		}
	}
</script>

<!-- <h3>Dies ist das Interface für den Kurs mit der UUID "{$page.params.course}"</h3> -->
<div style="display: flex; gap: 10px; flex-direction: column;">
	<div id="coursecontrols">
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem">Steuerung</h2>
			<div style="display: flex; gap: 10px;">
				<button>Start</button>
				<button style="display: flex; flex-direction: column; gap: 3px;">
					<div class="traffic-red traffic"></div>
					<div class="traffic-green traffic trafficOff"></div>
				</button>
				<button>Stop</button>
				<button>Registr. deaktiviert</button>
			</div>
		</Card>
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem">Abwesende</h2>
			<div style="display: flex; flex-direction: column;">
				<div>
					{#if absentsShown}
						{#if !leaderboard}
							<p>loading...</p>
						{:else}
							{#each leaderboard as user, index}
								{#if user.status == "offline"}
									<Profile username={user.name} />
								{/if}
							{/each}
						{/if}
					{/if}
				</div>
				<button on:click={() => {
					absentsShown = !absentsShown;
				}}>{absentsShown ? "Verstecken" : "Anzeigen"}</button>
			</div>
		</Card>
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem">Aufgabenüberprüfung <span class="badge">0</span></h2>
			<div style="display: flex; flex-direction: column;">
			</div>
		</Card>
	</div>
	<div id="leaderboard">
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem;">Rangliste</h2>
			<table>
				<tr>
					<th>Platz</th>
					<th>Name</th>
					<th>Übung</th>
					<th>Quiz %</th>
					<th>Aktionen</th>
				</tr>
				{#if !leaderboard}
					<p>loading...</p>
				{:else}
					{#each leaderboard as user, index}
						<tr>
							<td>{index + 1}</td>
							<td>
								<Profile username={user.name} status={user.status} />
							</td>
							<td>{user.level}</td>
							<td>{user.percentage}%</td>
							<td>
								<button title="{user.name} rauswerfen">
									<PersonKick on:click={() => {
										ws.send({
											type: "kick",
											uuid: user.uuid
										})
									}} size=40 />
								</button>
								<button title="{user.name} löschen">
									<PersonDelete on:click={() => {
										ws.send({
											type: "delete",
											uuid: user.uuid,
											courseUUID
										})
									}} size=40 color="#A03030" />
								</button>
								<button title="{user.name} löschen">
									<PersonVerify on:click={() => {
										if(!confirm("Are you sure you want to use this failsafe? If the student did not request this, who knows what will happen. The server might crash.")) return;
										ws.send(JSON.stringify({ type: "verify", uuid: user.uuid, course: courseUUID }));
									}} size=40 color="#30A030" />
								</button>
						</tr>
					{/each}
				{/if}
			</table>
		</Card>
	</div>
</div>

<style>
	#coursecontrols {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	#coursecontrols > :global(div:first-of-type) {
		width: 450px;
	}

	#leaderboard {
		display: flex;
		justify-content: center;
	}

	#leaderboard > :global(div),
	#coursecontrols > :global(div) {
		width: fit-content;
	}

	.traffic {
		width: 20px;
		height: 20px;
		border-radius: 100%;
	}

	.traffic-red {
		background-color: #C34040;
	}

	.traffic-green {
		background-color: #40C340;
	}

	.trafficOff {
		background-color: #1d1d1d;
	}

	@media(max-width: 900px) {
		#leaderboard {
			justify-content: left;
		}
	}
</style>