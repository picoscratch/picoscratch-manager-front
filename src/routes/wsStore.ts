import {browser} from '$app/environment';
import { get, writable } from "svelte/store";
import { WS_SERVER, schooldata } from "./stores.js";

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
			const packet = JSON.parse(e.data);
			if(packet.type == "ping") return;
			if(packet.type.startsWith("add") || packet.type.startsWith("delete")) {
				if(packet.error) {
					alert("Error: " + packet.error);
					return;
				}
				const elementTypes = [{type: "teacher", el: "teachers"}, {type: "room", el: "rooms"}, {type: "course", el: "courses"}];
				for(const et of elementTypes) {
					if(packet.type.toLowerCase() == "add" + et.type) {
						const sdata = get(schooldata);
						// @ts-ignore
						sdata[et.el].push(packet[et.type]);
						schooldata.set(sdata);
					} else if(packet.type.toLowerCase() == "delete" + et.type) {
						const sdata = get(schooldata);
						// @ts-ignore
						sdata[et.el] = sdata[et.el].filter((e) => e.uuid != packet.wasUUID);
						schooldata.set(sdata);
					}
				}
			}
			if(packet.type == "renameCourse") {
				const sdata = get(schooldata);
				sdata.courses = sdata.courses.map((c) => {
					if(c.uuid == packet.uuid) c.name = packet.name;
					return c;
				});
				schooldata.set(sdata);
			} else if(packet.type == "startCourse") {
				const sdata = get(schooldata);
				console.log("AA");
				
				sdata.courses = sdata.courses.map((c) => {
					console.log(c.uuid, packet.course.uuid);
					if(c.uuid == packet.course.uuid) c.isRunning = true;
					return c;
				});
				schooldata.set(sdata);
			} else if(packet.type == "stopCourse") {
				const sdata = get(schooldata);
				sdata.courses = sdata.courses.map((c) => {
					if(c.uuid == packet.course.uuid) c.isRunning = false;
					return c;
				});
				schooldata.set(sdata);
			} else if(packet.type == "allowRegister") {
				const sdata = get(schooldata);
				sdata.courses = sdata.courses.map((c) => {
					if(c.uuid == packet.course) c.allowRegister = packet.allow;
					return c;
				});
				schooldata.set(sdata);
			}
			messageStore.set(packet);
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