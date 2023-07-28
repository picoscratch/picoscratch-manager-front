import {browser} from '$app/environment';
import { writable } from "svelte/store";
import { WS_SERVER } from "./stores.js";

// export const ws = writable();
const messageStore = writable({});

export let sock: WebSocket;

if(browser) {
	sock = new WebSocket(WS_SERVER);
	
	sock.addEventListener("open", () => {
		console.log("Connected to WS server");
	});
	
	sock.addEventListener("message", (e) => {
		try {
			const data = JSON.parse(e.data);
			if(data.type == "ping") return;
			messageStore.set(data);
		} catch(e) {
			console.log("Server sent invalid JSON");
		}
	});

	sock.addEventListener("close", () => {
		console.log("WS connection closed");
		location.reload();
	});
}

export const ws = {
	subscribe: messageStore.subscribe,
	send: (data: any) => {
		console.log("WS to: ", data);
		sock.send(JSON.stringify(data));
	}
}