import { client } from "@/client";
import { queryElement } from "@/dom/queryTemplateElement";
import { filter } from "rxjs";

const elements = {
	app: queryElement("#app"),
	connectionChip: queryElement(".connectionChip"),
};

client.events
	.pipe(
		filter((event) => event.type === "CONNECT" || event.type === "DISCONNECT"),
	)
	.subscribe((event) => {
		if (event.type === "CONNECT") {
			renderConnected(event.connectionType);
		} else {
			renderDisconnected();
		}
	});

function renderConnected(method: "bluetooth" | "serial") {
	elements.app.classList.add("connected");
	elements.connectionChip.removeAttribute("disabled");

	if (method === "bluetooth") {
		elements.app.classList.add("connected-bluetooth");
	} else {
		elements.app.classList.add("connected-serial");
	}
}

function renderDisconnected() {
	elements.app.classList.remove("connected");
	elements.app.classList.remove("connected-bluetooth");
	elements.app.classList.remove("connected-serial");
	elements.connectionChip.setAttribute("disabled", "");
}
