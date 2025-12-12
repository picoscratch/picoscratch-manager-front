<script lang="ts">
	import { page } from "$app/stores";
	import Card from "$components/Card.svelte";
	import Profile from "$components/Profile.svelte";
	import PersonKick from "svelte-fluentui-icons/icons/PersonArrowRight_Filled.svelte";
	import PersonDelete from "svelte-fluentui-icons/icons/Delete_Filled.svelte";
	import PersonVerify from "svelte-fluentui-icons/icons/Checkmark_Filled.svelte";
	import Dismiss from "svelte-fluentui-icons/icons/Dismiss_Filled.svelte";
	import CSVIcon from "svelte-fluentui-icons/icons/DocumentTable_Filled.svelte";
	import NewIcon from "svelte-fluentui-icons/icons/New_Filled.svelte";
	import SettingsIcon from "svelte-fluentui-icons/icons/Settings_Filled.svelte";
	import { ws } from "$stores/wsStore";
	import { schooldata } from "$stores/stores";
	import ConfirmDialog from "$components/dialogs/ConfirmDialog.svelte";
	import Spinner from "$components/Spinner.svelte";
    import Dialog from "$components/dialogs/Dialog.svelte";
    import { m } from "../../../../../paraglide/messages";

	/** @type {import('./$types').PageData} */
	export let data: {props: {course: string}};

	$: console.log(data.props.course);

	let absentsShown = false;
	let courseUUID = data.props.course;
	let coursedata = $schooldata.courses.find((c: {uuid: string}) => c.uuid == courseUUID);
	let leaderboard: [{level: number, name: string, percentage: number, status: "offline" | "idle" | "online", uuid: string}];
	let verifications: [{name: string, uuid: string}];
	let tasks = [];
	let confirm: ConfirmDialog;
	let settingsShown = false;
	let tasksShown = false;
	$: courseUUID = data.props.course;
	$: coursedata = $schooldata.courses.find((c: {uuid: string}) => c.uuid == courseUUID);

	$: {
		console.log($ws);
		const data = $ws as any;
		if(data.type == "getCourseInfo") {
			leaderboard = data.leaderboard;
		} else if(data.type == "leaderboard") {
			if(data.course.uuid == courseUUID) leaderboard = data.leaderboard;
		} else if(data.type == "verifications") {
			verifications = data.verifications;
		} else if(data.type == "getTasks") {
			tasks = data.tasks;
		}
	}
</script>

<svelte:head>
	<title>PicoScratch Manager | {coursedata ? coursedata.name : m.nav_courses()}</title>
</svelte:head>

<ConfirmDialog bind:this={confirm} />

<Dialog bind:showDialog={settingsShown}>
	<div style="display: flex; align-items: center; flex-direction: column; gap: 10px;">
		<h2 style="margin: 0; font-size: 2rem; text-align: center;">{m.settings_for({ entity: coursedata.name })}</h2>
		<div style="display: flex; gap: 10px;">
			<button on:click={() => {
				ws.send({ type: "allowRegister", course: courseUUID, allow: !(coursedata?.allowRegister) });
			}}>{coursedata?.allowRegister ? m.register_enabled() : m.register_disabled()}</button>
			<button on:click={() => {
				if(coursedata?.maxLevel == -1) {
					ws.send({ type: "getTasks" });
					tasksShown = true;
				} else {
					ws.send({ type: "maxLevel", course: courseUUID, maxSection: -1, maxLevel: -1 })
				}
			}}>{coursedata?.maxLevel == -1 ? m.set_max_level() : m.remove_max_level()}</button>
		</div>
		<button on:click={() => {
			settingsShown = false;
		}}>{m.close()}</button>
	</div>
</Dialog>

<Dialog bind:showDialog={tasksShown}>
	<div style="display: flex; align-items: center; flex-direction: column; gap: 10px;">
		<h2 style="margin: 0; font-size: 2rem; text-align: center;">{m.set_max_level()}</h2>
		<div style="display: flex; gap: 10px; flex-direction: column; overflow: scroll;">
			<!-- [{ name, desc, img, tasks: [{ name, desc }] }] -->
			{#each tasks as section, secidx}
				{#each section.tasks as task, taskidx}
					<button on:click={() => {
						ws.send({ type: "maxLevel", course: courseUUID, maxSection: secidx, maxLevel: taskidx });
						tasksShown = false;
					}}>{section.name} &gt; {task.name}</button>
				{/each}
			{/each}
		</div>
		<div style="display: flex; gap: 10px;">
			<button on:click={() => {
				tasksShown = false;
			}}>{m.cancel()}</button>
			<button on:click={() => {
				tasksShown = false;
			}}>{m.ok()}</button>
		</div>
	</div>
</Dialog>

<!-- <h3>Dies ist das Interface für den Kurs mit der UUID "{$page.params.course}"</h3> -->
<div style="display: flex; gap: 10px; flex-direction: column;">
	<div id="coursecontrols">
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem">{m.control()}</h2>
			<div style="display: flex; gap: 10px;">
				<button on:click={() => {
					ws.send({
						type: "startCourse",
						uuid: courseUUID
					})

					// @ts-expect-error not typed yet
					if(window.rybbit) {
						// @ts-expect-error not typed yet
						window.rybbit.event("start_course", {
							school: $schooldata.name,
							course: coursedata?.name
						});
					}
				}}>{m.start()}</button>
				<button style="display: flex; flex-direction: column; gap: 3px;">
					<div class="traffic-red traffic {coursedata?.isRunning ? "trafficOff" : ""}"></div>
					<div class="traffic-green traffic {coursedata?.isRunning ? "" : "trafficOff"}"></div>
				</button>
				<button on:click={() => {
					ws.send({
						type: "stopCourse",
						uuid: courseUUID
					})

					// @ts-expect-error not typed yet
					if(window.rybbit) {
						// @ts-expect-error not typed yet
						window.rybbit.event("stop_course", {
							school: $schooldata.name,
							course: coursedata?.name
						});
					}
				}}>{m.stop()}</button>
				<button on:click={() => {
					settingsShown = true;
				}}>
					<SettingsIcon size=40 />
				</button>
			</div>
		</Card>
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem">{m.absents()}</h2>
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
				}}>{absentsShown ? m.hide() : m.show()}</button>
			</div>
		</Card>
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem">{m.taskverifications()} <span class="badge">{verifications ? verifications.length : "0"}</span></h2>
			<div style="display: flex; flex-direction: column; padding-top: 10px;">
				{#if verifications}
					{#each verifications as verification}
						<div style="display: flex;">
							<Profile username={verification.name} />
							<div style="margin-left: auto;">
								<button on:click={async () => {
									const confirmation = await confirm.confirm(verification.name + " aus der Aufgabe rauswerfen?", { subtext: "Der Schüler wird die Aufgabe erneut machen müssen." })
									if(!confirmation) return;
									ws.send({ type: "dismiss", uuid: verification.uuid, course: courseUUID });

									// @ts-expect-error not typed yet
									if(window.rybbit) {
										// @ts-expect-error not typed yet
										window.rybbit.event("dismiss_task", {
											school: $schooldata.name,
											course: coursedata?.name
										});
									}
								}}>
									<Dismiss size=40 color="#F55050" />
								</button>
								<button on:click={() => {
									ws.send({ type: "verify", uuid: verification.uuid, course: courseUUID });

									// @ts-expect-error not typed yet
									if(window.rybbit) {
										// @ts-expect-error not typed yet
										window.rybbit.event("verify_task", {
											school: $schooldata.name,
											course: coursedata?.name
										});
									}
								}}>
									<PersonVerify size=40 color="#50F550" />
								</button>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</Card>
		<Card>
			<h2 style="margin: 0; font-size: 1.9rem">
				{m.data()}
				<NewIcon style="width: 30px; height: 30px; transform: rotate(90deg) translateY(10px) translateX(-5px);" />
				<style>

				</style>
			</h2>
			<div style="display: flex; flex-direction: column; padding-top: 10px;">
				{#if leaderboard}
					<span>{m.quiz_avg()}: {Math.floor(leaderboard.map(s => {
						return s.percentage;
					}).reduce((a, b) => a + b, 0) / leaderboard.length)}%</span>
					<span>{m.avg_level()}: {Math.floor(leaderboard.map(s => {
						return s.level;
					}).reduce((a, b) => a + b, 0) / leaderboard.length)}</span>
				{:else}
					<p>loading...</p>
				{/if}
			</div>
		</Card>
	</div>
	<div id="leaderboard" style="overflow-y: hidden; max-width: 100vw;">
		<Card>
			{#if leaderboard.length > 0}
				<div style="display: flex; align-items: center; justify-content: space-between;">
					<h2 style="margin: 0; font-size: 1.9rem;">{m.leaderboard()}</h2>
					<button on:click={() => {
						const csv = [`${m.csv_place()},${m.csv_name()},${m.csv_exercise()},${m.csv_quiz()}`];
						leaderboard.forEach((user, index) => {
							csv.push(`${index + 1},${user.name},${user.level},${user.percentage}%`);
						});
						// download
						const blob = new Blob([csv.join("\n")], { type: "text/csv" });
						const url = window.URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = url;
						a.download = coursedata?.name + ".csv";
						a.click();
						window.URL.revokeObjectURL(url);
					}}>
						<CSVIcon size=40 />
					</button>
				</div>
				<table>
					<tbody>
						<tr>
							<th>{m.csv_place()}</th>
							<th>{m.csv_name()}</th>
							<th>{m.csv_exercise()}</th>
							<th>{m.csv_quiz()}</th>
							<th>{m.actions()}</th>
						</tr>
						{#if !leaderboard}
							<Spinner />
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
										<button title={m.kick_user({ user: user.name })} on:click={() => {
											ws.send({
												type: "kick",
												uuid: user.uuid
											})

											// @ts-expect-error not typed yet
											if(window.rybbit) {
												// @ts-expect-error not typed yet
												window.rybbit.event("kick_user", {
													school: $schooldata.name,
													course: coursedata?.name
												});
											}
										}}>
											<PersonKick size=40 />
										</button>
										<button title={m.delete_user({ user: user.name })} on:click={async () => {
											if(!await confirm.confirm(m.delete_user_confirm({ user: user.name }), { subtext: m.delete_user_confirm_subtext() })) return;
											ws.send({
												type: "delete",
												uuid: user.uuid,
												courseUUID
											})

											// @ts-expect-error not typed yet
											if(window.rybbit) {
												// @ts-expect-error not typed yet
												window.rybbit.event("delete_user", {
													school: $schooldata.name,
													course: coursedata?.name
												});
											}
										}}>
											<PersonDelete size=40 color="#A03030" />
										</button>
										<!-- <button title="{user.name} verifizieren">
											<PersonVerify on:click={() => {
												if(!confirm("Are you sure you want to use this failsafe? If the student did not request this, who knows what will happen. The server might crash.")) return;
												ws.send(JSON.stringify({ type: "verify", uuid: user.uuid, course: courseUUID }));
											}} size=40 color="#30A030" />
										</button> -->
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			{:else}
				<h2 style="margin: 0; font-size: 1.9rem;">{m.no_students()}</h2>
				<span>{m.no_students_subtext()}</span>
			{/if}
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