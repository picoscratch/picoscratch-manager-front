<script lang="ts">
	import "../styles.css";
	import "../background-blobs.css";
	import picoscratch_logo from "$lib/images/picoscratch-large.png";
	import { Turnstile } from "svelte-turnstile";
	import Spinner from "$components/Spinner.svelte";
	import { SERVER } from "$stores/stores";
	import { m } from "../../paraglide/messages";
    import { getLocale, setLocale } from "../../paraglide/runtime";

	let schoolname: string;
	let password: string;
	let cf_token: string;
	let code: string = "";
	let state: "form" | "loading" | "finished" = "form";
</script>

<svelte:head>
	<title>{m.demo_title()}</title>
	<meta name="description" content={m.demo_description()} />
</svelte:head>

<div style="display: flex; align-items: center; flex-direction: column;">
	<img src={picoscratch_logo} alt="PicoScratch Logo" width="400rem" style="margin: 20px; border-radius: 10px;" class="logo">
	{#if state == "form" || state == "loading"}
		<select value={getLocale()} on:change={(e) => {
			// @ts-expect-error todo
			setLocale(e.target.value);
		}}>
			<option value="de">Deutsch</option>
			<option value="en">English</option>
		</select>
		<div class="forms">
			<div class="form">
				<h2>{m.demo_schoolname()}</h2>
				<span>{m.demo_schoolname_subtext()}</span>
				<input type="text" bind:value={schoolname} disabled={state == "loading"}>
			</div>
			<div class="form">
				<h2>{m.demo_admin()}</h2>
				<span>{m.demo_admin_subtext()}</span>
				<input type="password" bind:value={password} disabled={state == "loading"}>
			</div>
			<div class="form">
				<h2>{m.demo_captcha()}</h2>
				<Turnstile siteKey="0x4AAAAAAAIMlCCSCgEWr8BD" theme="dark" on:turnstile-callback={(e) => {
					cf_token = e.detail.token;
				}} class="ts" />
			</div>
			<div class="form">
				{#if state == "loading"}
					<h3 style="display: flex; justify-content: center; gap: 10px;">
						<Spinner />
						<span>{m.demo_loading()}</span>
					</h3>
				{:else}
					<button on:click={async () => {
						state = "loading";
						const res = await fetch(`${SERVER}makeSchool`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: JSON.stringify({
								schoolname,
								password,
								lang: getLocale(),
								"cf-turnstile-response": cf_token
							})
						}).then(res => res.json());
						console.log(res);
						if(res.error) {
							state = "form";
							if(res.error == "Invalid captcha") {
								alert(m.demo_solve_captcha());
							} else {
								alert(res.error);
							}
							return;
						}
						if(!res.code) {
							alert(m.demo_error());
							state = "form";
							return;
						}
						code = res.code;
						state = "finished";
					}} data-rybbit-event="demo_register">{m.demo_register()}</button>
				{/if}
			</div>
		</div>
	{:else}
		<div style="display: flex; flex-direction: column; gap: 10px; align-items: center;" class="finished">
			<h2 style="margin: 0;">{m.demo_welcome()}</h2>
			<span>{m.demo_welcome_subtext({ code })}</span>
			<span><ul>{m.demo_welcome_subtext_2()}</ul></span>
			<a href="../school/{code}">
				<button>{m.demo_go_to_manager()}</button>
			</a>
		</div>
	{/if}
</div>

<style>
	.forms {
		display: flex;
		flex-direction: column;
		gap: 30px;
		margin-top: 25px;
	}
	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}

	.form h2 {
		font-size: 2.5rem;
		margin: 0;
	}

	.form h3 {
		font-size: 2rem;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.form input {
		width: 100%;
		text-align: center;
	}

	.finished h2 {
		font-size: 2.5rem;
	}

	.finished span {
		font-size: 1.5rem;
		text-align: center;
	}

	@media (max-width: 500px) {
		.logo {
			width: 18rem;
		}

		.form h2 {
			font-size: 1.5rem;
		}
		
		.form span {
			font-size: 0.8rem;
		}
		
		.form h3 {
			flex-direction: column;
			font-size: 1rem;
		}

		.form h3 span {
			font-size: 1.4rem;
		}

		.form input {
			font-size: 1.6rem;
			width: 80%;
		}

		.finished h2 {
			font-size: 1.7rem;
		}

		.finished span {
			font-size: 1.4rem;
		}
	}

	.code {
		text-decoration: underline;
	}
</style>