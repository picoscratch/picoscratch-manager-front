import { get } from "svelte/store";
import { ws, sock } from "../../../../wsStore";
import { loggedIn } from "../../../../stores";

export const prerender = false;
export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	function fetchInfo() {
		if(!get(loggedIn)) {
			setTimeout(fetchInfo, 1000)
			return
		}
		ws.send({
			type: "getCourseInfo",
			uuid: params.course
		})
		ws.send({
			type: "getVerifications",
			course: params.course
		})
	}
	if(sock.readyState == 0) {
		sock.addEventListener("open", () => {
			setTimeout(fetchInfo, 1000)
		}, { once: true });
	} else {
		fetchInfo()
	}
	return {
		props: {
			course: params.course
		}
	}
}