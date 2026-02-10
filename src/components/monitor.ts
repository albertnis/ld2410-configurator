import { client, type ClientEvent } from "@/client";
import {
	queryTemplateElement,
	importTemplate,
	queryElement,
} from "@/dom/queryTemplateElement";
import { assertNever } from "@/types";
import { debounce, debounceTime, filter } from "rxjs";

const ACTIVITY_INDICATOR_FLASH_DURATION_MS = 40;

const templates = {
	rx: queryTemplateElement("#template-monitor-logEntry-rx"),
	tx: queryTemplateElement("#template-monitor-logEntry-tx"),
	connect: queryTemplateElement("#template-monitor-logEntry-connect"),
	disconnect: queryTemplateElement("#template-monitor-logEntry-disconnect"),
};

const elements = {
	monitor: queryElement(".monitor") as HTMLOListElement,
	log: queryElement(".monitor-log") as HTMLOListElement,
	scrollToBottomButton: queryElement(
		"#monitor-scrollToBottomButton",
	) as HTMLButtonElement,
	hideRadarOutputInput: queryElement(
		"#monitor-hideRadarOutputInput",
	) as HTMLInputElement,
	minimizeInput: queryElement("#monitor-minimizeInput") as HTMLInputElement,
	activityIndicatorTx: queryElement(".activityIndicator-tx") as SVGElement,
	activityIndicatorRx: queryElement(".activityIndicator-rx") as SVGElement,
};

const state = {
	scrollToBottom: true,
};

client.events.subscribe((event) => renderLogEntry(event, new Date()));

client.events
	.pipe(
		filter((event) => event.type === "TX"),
		debounceTime(ACTIVITY_INDICATOR_FLASH_DURATION_MS * 2),
	)
	.subscribe(() => flashActivityIndicator("tx"));

client.events
	.pipe(
		filter((event) => event.type === "RX"),
		debounceTime(ACTIVITY_INDICATOR_FLASH_DURATION_MS * 2),
	)
	.subscribe(() => flashActivityIndicator("rx"));

elements.scrollToBottomButton.addEventListener("click", () => {
	setScrollToBottom(true);
});
elements.minimizeInput.addEventListener("change", (event) => {
	const checked = (event.target as HTMLInputElement).checked;
	setMinimized(checked);
});
elements.hideRadarOutputInput.addEventListener("change", (event) => {
	const checked = (event.target as HTMLInputElement).checked;
	setHideRadarOutput(checked);
});
elements.log.addEventListener("scroll", function () {
	const scrolledToBottom =
		elements.log.scrollHeight -
			elements.log.scrollTop -
			elements.log.clientHeight <
		24;

	setScrollToBottom(scrolledToBottom);
});

function renderLogEntry(event: ClientEvent, timestamp: Date): void {
	let fragment;
	switch (event.type) {
		case "CONNECT":
		case "DISCONNECT": {
			fragment = importTemplate(
				event.type === "CONNECT" ? templates.connect : templates.disconnect,
			);
			break;
		}
		case "RX":
		case "TX": {
			fragment = importTemplate(
				event.type === "TX" ? templates.tx : templates.rx,
			);
			const code = queryElement("code", fragment);
			const chip = queryElement(".chip", fragment);
			code.innerHTML = formatBytes(event.bytes);
			chip.innerHTML = event.payload.type;
			if (
				event.type === "RX" &&
				(event.payload.type === "RADAR_DATA_OUTPUT" ||
					event.payload.type === "RADAR_ENGINEERING_DATA_OUTPUT")
			) {
				const entry = queryElement(".monitor-log-entry", fragment);
				entry.classList.add("radarOutput");
			}
			break;
		}
		default:
			assertNever(event);
	}

	if (fragment == null) {
		return;
	}

	const time = queryElement("time", fragment);
	time.innerHTML = timestamp.toLocaleTimeString(undefined, {
		hour: "numeric",
		minute: "2-digit",
		second: "2-digit",
		fractionalSecondDigits: 3,
	});
	time.setAttribute("datetime", timestamp.toISOString());

	elements.log.appendChild(fragment);

	if (elements.log.childElementCount > 500) {
		elements.log.removeChild(elements.log.childNodes[0]);
	}

	if (state.scrollToBottom) {
		elements.log.scrollTop = elements.log.scrollHeight;
	}
}

function flashActivityIndicator(type: "tx" | "rx") {
	const element =
		type === "tx" ? elements.activityIndicatorTx : elements.activityIndicatorRx;

	element.animate([{ fill: "currentColor" }, { fill: "currentColor" }], {
		duration: ACTIVITY_INDICATOR_FLASH_DURATION_MS,
	});
}

function setScrollToBottom(scrollToBottom: boolean) {
	state.scrollToBottom = scrollToBottom;
	if (scrollToBottom) {
		elements.log.scrollTop = elements.log.scrollHeight;
	}
}

function setHideRadarOutput(hideRadarOutput: boolean) {
	elements.hideRadarOutputInput.checked = hideRadarOutput;
	if (hideRadarOutput) {
		elements.log.classList.add("hideRadarOutput");
	} else {
		elements.log.classList.remove("hideRadarOutput");
	}
}

function setMinimized(minimized: boolean) {
	elements.minimizeInput.checked = minimized;
	if (minimized) {
		elements.monitor.classList.add("monitor-minimized");
	} else {
		elements.monitor.classList.remove("monitor-minimized");
	}
}

function formatBytes(bytes: Uint8Array): string {
	const hex = bytes.toHex();
	let output = "";

	for (let i = 0; i < hex.length; i++) {
		if (i % 2 === 0 && i > 0) {
			output += " ";
		}
		output += hex[i];
	}
	return output;
}
