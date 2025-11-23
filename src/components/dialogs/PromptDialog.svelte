<script lang="ts">
    import { m } from "../../paraglide/messages";
	import Dialog from "./Dialog.svelte";

	type prompt = (title: string, { placeholder, value, submit, cancel }?: { placeholder?: string | undefined; value?: string | undefined; submit?: string | undefined; cancel?: string | undefined; }) => Promise<string | null>;

	let title = "Prompt Dialog";
	let placeholder = "";
	let value = "";
	let submit = m.ok();
	let cancel = m.cancel();
	let type = "text";
	let showDialog = false;
	let resolve: (value: string | null) => void;
	let input: HTMLInputElement;

	export function prompt(
		_title: string,
		{ placeholder: _placeholder, value: _value, submit: _submit, cancel: _cancel, type: _type }:
		{
			placeholder?: string,
			value?: string,
			submit?: string,
			cancel?: string,
			type?: "text" | "password"
		} = {placeholder: "", value: "", submit: m.ok(), cancel: m.cancel(), type: "text"}): Promise<string | null> {
		return new Promise((res) => {
			if(!_placeholder) _placeholder = "";
			if(!_value) _value = "";
			if(!_submit) _submit = m.ok();
			if(!_cancel) _cancel = m.cancel();
			if(!_type) _type = "text";
			title = _title;
			placeholder = _placeholder;
			value = _value;
			submit = _submit;
			cancel = _cancel;
			type = _type;
			input.value = "";
			resolve = res;

			showDialog = true;
		})
	}

	function submitValue() {
		resolve(input.value);
		showDialog = false;
	}

	function cancelSubmit() {
		resolve(null);
		showDialog = false;
	}
</script>

<Dialog {showDialog}>
	<div style="display: flex; align-items: center; flex-direction: column; gap: 10px;">
		<h2 style="margin: 0; font-size: 2rem; text-align: center;">{title}</h2>
		<input {type} {placeholder} {value} bind:this={input} on:keyup={(e) => {
			if(e.key === "Enter") submitValue();
		}}>
		<div style="display: flex; gap: 10px;">
			<button on:click={submitValue}>{submit}</button>
			<button on:click={cancelSubmit}>{cancel}</button>
		</div>
	</div>
</Dialog>