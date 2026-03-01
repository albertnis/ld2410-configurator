import { filter } from "rxjs";
import { client, type ErrorCode } from "@/client";
import {
	importTemplate,
	queryElement,
	queryTemplateElement,
} from "@/dom/queryTemplateElement";

const elements = {
	snackbarRegion: queryElement(".snackbarRegion"),
};

const templates = {
	snackbar: queryTemplateElement("#template-snackbar"),
};

client.events
	.pipe(filter((event) => event.type === "ERROR"))
	.subscribe((event) => {
		const message = messages[event.error];
		renderErrorSnackbar(message);
	});

function renderErrorSnackbar(message: string) {
	const fragment = importTemplate(templates.snackbar);
	const content = queryElement(".snackbarContent", fragment);
	content.innerHTML = message;

	elements.snackbarRegion.appendChild(fragment);
	const element = elements.snackbarRegion.lastElementChild;

	if (element instanceof HTMLElement) {
		setTimeout(() => element.classList.add("dead"), 5000);
	}
}

const messages: Record<ErrorCode, string> = {
	BLUETOOTH_DEVICE_REQUEST_FAILURE:
		"An error occurred during connection: Bluetooth device selection was cancelled",
	BLUETOOTH_DEVICE_NOT_GATT:
		"An error occurred during connection: The Bluetooth device does not support GATT",
	BLUETOOTH_GATT_CONNECT_FAILURE:
		"An error occurred during connection: Failed to connect to the Bluetooth device over GATT. This happens randomly; try connecting again.",
	BLUETOOTH_GATT_SERVICE_FAILURE:
		"An error occurred during connection: Failed to retrieve GATT service and characteristics",
	SERIAL_DEVICE_REQUEST_FAILURE:
		"An error occurred during connection: Serial device selection was cancelled",
	SERIAL_PORT_OPEN_FAILURE:
		"An error occurred during connection: Failed to open serial port",
};
