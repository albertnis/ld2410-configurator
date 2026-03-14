import { client, stateUpdates } from "@/client";
import { queryElement } from "@/dom/queryTemplateElement";
import { filter, map } from "rxjs";

const elements = {
	timeoutPeriodInput: queryElement("#timeoutPeriodInput") as HTMLInputElement,
	maxMovingDistanceGateInput: queryElement(
		"#maxMovingDistanceGateInput",
	) as HTMLInputElement,
	maxStaticDistanceGateInput: queryElement(
		"#maxStaticDistanceGateInput",
	) as HTMLInputElement,
	form: queryElement("#numberInputs") as HTMLFormElement,
};

stateUpdates
	.pipe(
		map((x) => x.maximumMovingDistanceGate),
		filter((x) => x != null),
	)
	.subscribe((maximumMovingDistanceGate) => {
		elements.maxMovingDistanceGateInput.value =
			maximumMovingDistanceGate.toString();
	});

stateUpdates
	.pipe(
		map((x) => x.maximumStaticDistanceGate),
		filter((x) => x != null),
	)
	.subscribe((maximumStaticDistanceGate) => {
		elements.maxStaticDistanceGateInput.value =
			maximumStaticDistanceGate.toString();
	});

stateUpdates
	.pipe(
		map((x) => x.timeout),
		filter((x) => x != null),
	)
	.subscribe((timeout) => {
		elements.timeoutPeriodInput.value = timeout.toString();
	});

function submitValues() {
	if (!elements.form.checkValidity()) {
		elements.form.reportValidity();
		return;
	}

	client.sendCommand({
		type: "ENABLE_CONFIGURATION_COMMAND",
	});

	client.sendCommand({
		type: "MAXIMUM_DISTANCE_GATE",
		maximumMovingDistanceGate: Number(
			elements.maxMovingDistanceGateInput.value,
		),
		maximumStaticDistanceGate: Number(
			elements.maxStaticDistanceGateInput.value,
		),
		timeout: Number(elements.timeoutPeriodInput.value),
	});

	client.sendCommand({
		type: "END_CONFIGURATION_COMMAND",
	});
}

elements.maxMovingDistanceGateInput.addEventListener("blur", submitValues);
elements.maxStaticDistanceGateInput.addEventListener("blur", submitValues);
elements.timeoutPeriodInput.addEventListener("blur", submitValues);
elements.form.addEventListener("submit", (event) => {
	event.preventDefault(), submitValues();
});
