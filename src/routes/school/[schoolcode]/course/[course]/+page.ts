import { ws, sock } from "../../../../wsStore";

export const prerender = false;
export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	function fetchInfo() {
		ws.send({
			type: "getCourseInfo",
			uuid: params.course
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