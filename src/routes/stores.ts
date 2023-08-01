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

export const loggedIn = writable(false);
export const SERVER = "https://server.picoscratch.de/api/";
export const WS_SERVER = "wss://server.picoscratch.de";
export const ROOT = "/";
export const schooldata = writable({
	channel: "",
	code: "",
	courses: [{name: "", uuid: ""}],
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