import { stateUpdates } from "@/client";
import { queryElement } from "@/dom/queryTemplateElement";
import type { Sensitivity } from "@/ld2410/types";
import { filter, map } from "rxjs";

const elements = {
	detectionDistance: queryElement(".distanceIndicator-detectionDistance"),
	movementTargetDistance: queryElement(
		".distanceIndicator-movementTargetDistance",
	),
	stationaryTargetDistance: queryElement(
		".distanceIndicator-stationaryTargetDistance",
	),
	energyIndicators: [
		{
			motion: queryElement(".energyIndicator-motion-0"),
			rest: queryElement(".energyIndicator-rest-0"),
		},
		{
			motion: queryElement(".energyIndicator-motion-1"),
			rest: queryElement(".energyIndicator-rest-1"),
		},
		{
			motion: queryElement(".energyIndicator-motion-2"),
			rest: queryElement(".energyIndicator-rest-2"),
		},
		{
			motion: queryElement(".energyIndicator-motion-3"),
			rest: queryElement(".energyIndicator-rest-3"),
		},
		{
			motion: queryElement(".energyIndicator-motion-4"),
			rest: queryElement(".energyIndicator-rest-4"),
		},
		{
			motion: queryElement(".energyIndicator-motion-5"),
			rest: queryElement(".energyIndicator-rest-5"),
		},
		{
			motion: queryElement(".energyIndicator-motion-6"),
			rest: queryElement(".energyIndicator-rest-6"),
		},
		{
			motion: queryElement(".energyIndicator-motion-7"),
			rest: queryElement(".energyIndicator-rest-7"),
		},
		{
			motion: queryElement(".energyIndicator-motion-8"),
			rest: queryElement(".energyIndicator-rest-8"),
		},
	],
};

stateUpdates
	.pipe(
		map((x) => x.detectionDistanceCm),
		filter((x) => x != null),
	)
	.subscribe((distanceCm) => {
		renderDistanceIndicator("detectionDistance", distanceCm);
	});

stateUpdates
	.pipe(
		map((x) => x.movementTargetDistanceCm),
		filter((x) => x != null),
	)
	.subscribe((distanceCm) => {
		renderDistanceIndicator("movementTargetDistance", distanceCm);
	});

stateUpdates
	.pipe(
		map((x) => x.stationaryTargetDistanceCm),
		filter((x) => x != null),
	)
	.subscribe((distanceCm) => {
		renderDistanceIndicator("stationaryTargetDistance", distanceCm);
	});

function renderDistanceIndicator(
	element:
		| "detectionDistance"
		| "movementTargetDistance"
		| "stationaryTargetDistance",
	distanceCm: number,
) {
	queryElement("data", elements[element]).setAttribute(
		"value",
		distanceCm.toString(),
	);
	queryElement(".value", elements[element]).innerHTML = distanceCm.toFixed(0);
}

stateUpdates
	.pipe(
		map((x) => x.targetStatus),
		filter((x) => x != null),
	)
	.subscribe((targetStatus) => {
		renderDetected(
			"movementTargetDistance",
			targetStatus === "MOVEMENT_AND_STATIONARY_TARGET" ||
				targetStatus === "MOVEMENT_TARGET",
		);

		renderDetected(
			"stationaryTargetDistance",
			targetStatus === "MOVEMENT_AND_STATIONARY_TARGET" ||
				targetStatus === "STATIONARY_TARGET",
		);
	});

function renderDetected(
	element: "movementTargetDistance" | "stationaryTargetDistance",
	detected: boolean,
) {
	if (detected) {
		elements[element].setAttribute("data-detected", "");
	} else {
		elements[element].removeAttribute("data-detected");
	}
}

stateUpdates
	.pipe(
		map((x) => x.energy),
		filter((x) => x != null),
	)
	.subscribe((energies) => {
		for (const [gateKey, energy] of Object.entries(energies)) {
			const gate = Number(gateKey) as keyof Sensitivity;
			renderEnergyIndicator(gate, energy);
		}
	});

function renderEnergyIndicator(
	gate: keyof Sensitivity,
	energy: Sensitivity[0],
) {
	for (const energyType of ["motion", "rest"] as const) {
		const element = elements.energyIndicators[gate][energyType];
		element.setAttribute("value", energy[energyType].toString());
		element.innerHTML = energy[energyType].toString();
	}
}
