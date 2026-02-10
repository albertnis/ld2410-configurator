import { client, stateUpdates } from "@/client";
import { queryElement } from "@/dom/queryTemplateElement";
import type { Sensitivity } from "@/ld2410/types";
import { filter, map } from "rxjs";

const elements = {
	sensitivityInputs: [
		{
			motion: queryElement("#sensitivity-motion-0") as HTMLInputElement,
			rest: queryElement("#sensitivity-rest-0") as HTMLInputElement,
		},
		{
			motion: queryElement("#sensitivity-motion-1") as HTMLInputElement,
			rest: queryElement("#sensitivity-rest-1") as HTMLInputElement,
		},
		{
			motion: queryElement("#sensitivity-motion-2") as HTMLInputElement,
			rest: queryElement("#sensitivity-rest-2") as HTMLInputElement,
		},
		{
			motion: queryElement("#sensitivity-motion-3") as HTMLInputElement,
			rest: queryElement("#sensitivity-rest-3") as HTMLInputElement,
		},
		{
			motion: queryElement("#sensitivity-motion-4") as HTMLInputElement,
			rest: queryElement("#sensitivity-rest-4") as HTMLInputElement,
		},
		{
			motion: queryElement("#sensitivity-motion-5") as HTMLInputElement,
			rest: queryElement("#sensitivity-rest-5") as HTMLInputElement,
		},
		{
			motion: queryElement("#sensitivity-motion-6") as HTMLInputElement,
			rest: queryElement("#sensitivity-rest-6") as HTMLInputElement,
		},
		{
			motion: queryElement("#sensitivity-motion-7") as HTMLInputElement,
			rest: queryElement("#sensitivity-rest-7") as HTMLInputElement,
		},
		{
			motion: queryElement("#sensitivity-motion-8") as HTMLInputElement,
			rest: queryElement("#sensitivity-rest-8") as HTMLInputElement,
		},
	],
};

stateUpdates
	.pipe(
		map((x) => x.sensitivity),
		filter((x) => x != null),
	)
	.subscribe((sensitivities) => {
		for (const [gateKey, sensitivity] of Object.entries(sensitivities)) {
			const gate = Number(gateKey) as keyof Sensitivity;
			renderSensitivityInput(gate, sensitivity);
		}
	});

function renderSensitivityInput(
	gate: keyof Sensitivity,
	sensitivity: Sensitivity[0],
) {
	for (const energyType of ["motion", "rest"] as const) {
		const element = elements.sensitivityInputs[gate][energyType];
		element.setAttribute("value", sensitivity[energyType].toString());
		// element.value = sensitivity[energyType].toString();
		if (!(gate <= 1 && energyType === "rest")) {
			element.removeAttribute("disabled");
		}
	}
}

for (const [gateKey, { motion, rest }] of Object.entries(
	elements.sensitivityInputs,
)) {
	const gate = Number(gateKey) as keyof Sensitivity;

	const handleChange = () => {
		renderSensitivityInput(gate, {
			motion: Number(motion.value),
			rest: Number(rest.value),
		});
		client.sendCommand({
			type: "ENABLE_CONFIGURATION_COMMAND",
		});
		client.sendCommand({
			type: "RANGE_GATE_SENSITIVITY",
			gate,
			motionSensitivity: Number(motion.value),
			staticSensitivity: Number(rest.value),
		});
		client.sendCommand({
			type: "END_CONFIGURATION_COMMAND",
		});
	};

	motion.addEventListener("change", handleChange);
	motion.addEventListener("motion", handleChange);
}
