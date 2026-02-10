import type { LD2410ReadPayload, LD2410WritePayload } from "@/ld2410/types";
import type { Observable } from "rxjs";

export interface TxEvent {
	type: "TX";
	payload: LD2410WritePayload;
	bytes: Uint8Array;
}

export interface RxEvent {
	type: "RX";
	payload: LD2410ReadPayload;
	bytes: Uint8Array;
}

export type CommunicationEvent = TxEvent | RxEvent;

export interface CommunicationClient {
	events: Observable<CommunicationEvent>;
	queueTxPayload(payload: LD2410WritePayload): void;
	disconnect(): Promise<void>;
}
