import { client } from "@/client";
import { queryElement } from "@/dom/queryTemplateElement";
import { filter } from "rxjs";

const elements = {
	app: queryElement("#app"),
};

client.events
	.pipe(
		filter((event) => event.type === "CONNECT" || event.type === "DISCONNECT"),
	)
	.subscribe((event) => renderAppConnectionStatus(event.type === "CONNECT"));

function renderAppConnectionStatus(connected: boolean) {
	if (connected) {
		elements.app.setAttribute("data-connected", "");
	} else {
		elements.app.removeAttribute("data-connected");
	}
}
