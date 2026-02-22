import { client } from "@/client";
import { queryElement } from "@/dom/queryTemplateElement";
import { DEFAULT_BLUETOOTH_PASSWORD } from "@/ld2410/constants";

const elements = {
	bluetoothBox: queryElement(".bluetooth.connectBox") as HTMLDivElement,
	bluetoothButton: queryElement("#connectBluetooth-button"),
	bluetoothForm: queryElement(".bluetooth.connectBox form") as HTMLFormElement,
	bluetoothUnsupportedCallout: queryElement(
		".bluetooth.connectBox .unsupportedCallout",
	) as HTMLFormElement,
	serialBox: queryElement(".serial.connectBox") as HTMLDivElement,
	serialButton: queryElement("#connectSerial-button"),
	serialForm: queryElement(".serial.connectBox form") as HTMLFormElement,
	baudRateSelect: queryElement(
		"#connectSerial-baudRateSelect",
	) as HTMLSelectElement,
	bluetoothPasswordInput: queryElement(
		"#connectBluetooth-bluetoothPasswordInput",
	) as HTMLInputElement,
	useDefaultBluetoothPasswordButton: queryElement(
		"#connectBluetooth-useDefaultBluetoothPasswordButton",
	),
};

interface Support {
	bluetooth:
		| {
				supported: true;
		  }
		| {
				supported: false;
				reason: "unavailable" | "unsupported";
		  };
	serial: {
		supported: boolean;
	};
}

getSupport().then(renderSupport).catch(console.error);

elements.serialForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const baud = Number(elements.baudRateSelect.value);
	console.log("Connecting with baud", baud);
	markAsLoading("serial");
	client.connectSerial(baud).finally(markAsNotLoading);
});

elements.bluetoothForm.addEventListener("submit", (event) => {
	event.preventDefault();
	if (!elements.bluetoothForm.reportValidity()) {
		return;
	}
	markAsLoading("bluetooth");
	client
		.connectBluetooth(elements.bluetoothPasswordInput.value)
		.finally(markAsNotLoading);
});

elements.useDefaultBluetoothPasswordButton.addEventListener("click", () => {
	elements.bluetoothPasswordInput.value = DEFAULT_BLUETOOTH_PASSWORD;
});

function renderSupport(support: Support) {
	if (support.serial.supported) {
		elements.serialBox.classList.add("supported");
	} else {
		elements.serialBox.classList.add("unsupported");
	}

	if (support.bluetooth.supported) {
		elements.bluetoothBox.classList.add("supported");
	} else {
		if (support.bluetooth.reason === "unavailable") {
			elements.bluetoothUnsupportedCallout.innerHTML =
				"Your device has no Bluetooth adapter";
		}
		elements.bluetoothBox.classList.add("unsupported");
	}
}

async function getSupport(): Promise<Support> {
	return {
		serial: {
			supported: navigator.serial != null,
		},
		bluetooth:
			navigator.bluetooth != null
				? (await navigator.bluetooth.getAvailability())
					? {
							supported: true,
						}
					: { supported: false, reason: "unavailable" }
				: {
						supported: false,
						reason: "unsupported",
					},
	};
}

function markAsLoading(method: "bluetooth" | "serial") {
	for (const el of [elements.bluetoothButton, elements.serialButton]) {
		el.setAttribute("disabled", "true");
		el.setAttribute("aria-busy", "true");
	}
	elements[`${method}Button`].classList.add("loading");
}

function markAsNotLoading() {
	for (const el of [elements.bluetoothButton, elements.serialButton]) {
		el.removeAttribute("disabled");
		el.removeAttribute("aria-busy");
		el.classList.remove("loading");
	}
}
