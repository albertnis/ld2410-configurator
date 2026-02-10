import { client } from "@/client";
import { queryElement } from "@/dom/queryTemplateElement";
import {
	DEFAULT_BLUETOOTH_PASSWORD,
	DEFAULT_SERIAL_BAUD_RATE,
} from "@/ld2410/constants";

const elements = {
	bluetoothButton: queryElement(".button-connectBluetooth"),
	bluetoothForm: queryElement(".connectBluetooth-form") as HTMLFormElement,
	serialButton: queryElement(".button-connectSerial"),
	serialForm: queryElement(".connectSerial-form") as HTMLFormElement,
	baudRateSelect: queryElement(
		"#connectSerial-baudRateSelect",
	) as HTMLSelectElement,
	bluetoothPasswordInput: queryElement(
		"#connectBluetooth-bluetoothPasswordInput",
	) as HTMLInputElement,
	useDefaultBluetoothPasswordButton: queryElement(
		".connectBluetooth-useDefaultBluetoothPasswordButton",
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
	client.connectSerial(baud);
});

elements.bluetoothForm.addEventListener("submit", (event) => {
	event.preventDefault();
	client.connectBluetooth(elements.bluetoothPasswordInput.value);
});

elements.useDefaultBluetoothPasswordButton.addEventListener("click", () => {
	elements.bluetoothPasswordInput.value = DEFAULT_BLUETOOTH_PASSWORD;
});

function renderSupport(support: Support) {
	if (support.serial.supported) {
		elements.serialButton.removeAttribute("disabled");
		elements.serialButton.removeAttribute("title");
	} else {
		elements.serialButton.setAttribute("disabled", "");
		elements.serialButton.setAttribute(
			"title",
			"Your browser doesn't support Web Serial",
		);
	}

	if (support.bluetooth.supported) {
		elements.bluetoothButton.removeAttribute("disabled");
	} else if (support.bluetooth.reason === "unavailable") {
		elements.bluetoothButton.setAttribute("disabled", "");
		elements.bluetoothButton.setAttribute(
			"title",
			"Your device has no Bluetooth adapter",
		);
	} else {
		elements.bluetoothButton.setAttribute("disabled", "");
		elements.bluetoothButton.setAttribute(
			"title",
			"Your browser doesn't support Web Bluetooth",
		);
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
