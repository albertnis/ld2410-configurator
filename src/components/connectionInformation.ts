import { client, stateUpdates } from "@/client";
import { queryElement } from "@/dom/queryTemplateElement";
import { filter, map } from "rxjs";

const elements = {
	firmwareVersion: queryElement(".connectionInformation-firmwareVersion"),
	macAddress: queryElement(".connectionInformation-macAddress"),
	protocolVersion: queryElement(".connectionInformation-protocolVersion"),
	disconnectButton: queryElement(".disconnectButton"),
	restartButton: queryElement(".restartButton"),
	connectedPopover: queryElement("#connectedPopover"),
};

stateUpdates
	.pipe(
		map((x) => x.firmwareVersion),
		filter((x) => x != null),
	)
	.subscribe((x) => {
		elements.firmwareVersion.innerHTML = x;
	});

stateUpdates
	.pipe(
		map((x) => x.macAddress),
		filter((x) => x != null),
	)
	.subscribe((x) => {
		elements.macAddress.innerHTML = x;
	});

stateUpdates
	.pipe(
		map((x) => x.protocolVersion),
		filter((x) => x != null),
	)
	.subscribe((x) => {
		elements.protocolVersion.innerHTML = x.toString();
	});

elements.restartButton.addEventListener("click", () => {
	client.sendCommand({
		type: "ENABLE_CONFIGURATION_COMMAND",
	});

	client.sendCommand({
		type: "RESTART",
	});
});

elements.disconnectButton.addEventListener("click", () => {
	client.disconnect().catch(console.error);
});
