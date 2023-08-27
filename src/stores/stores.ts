import { writable } from "svelte/store";

// export const navItems = [
// 	{
// 		text: "Lehrer",
// 		url: "teachers",
// 		adminOnly: false
// 	},
// 	{
// 		text: "Räume",
// 		url: "rooms"
// 	},
// 	{
// 		text: "Kurse",
// 		url: "courses"
// 	}
// ];

export const navPosition = writable("open");
export const loggedIn = writable(false);
// export const SERVER = "https://server.picoscratch.de/api/";
// export const WS_SERVER = "wss://server.picoscratch.de";
export const SERVER = "http://localhost:8080/api/";
export const WS_SERVER = "ws://localhost:8080";
export const ROOT = "/";
export const schooldata = writable({
	channel: "",
	code: "",
	courses: [{
		name: "",
		uuid: "",
		allowRegister: false,
		isRunning: false,
		maxSection: -1,
		maxLevel: -1
	}],
	createdAt: "",
	deletedAt: null,
	isDemo: true,
	lang: "de",
	name: "",
	rooms: [{name: "", uuid: "", courseUuid: ""}],
	teachers: [{name: "", uuid: ""}],
	updatedAt: "",
	uuid: ""
});
export const myProfile = writable({
	username: ""
});