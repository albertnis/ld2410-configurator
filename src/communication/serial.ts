import { Result } from "@/types";
import type { CommunicationClient, CommunicationEvent, RxEvent } from ".";
import { filter, lastValueFrom, map, Subject, timeout } from "rxjs";
import { bufferDebounce, rateLimit } from "@/operators/bufferDebounce";
import { concatUint8Arrays } from "@/array/concatUint8Array";
import type { LD2410WritePayload } from "@/ld2410/types";
import { encodePayloadToByteArray } from "@/ld2410/encode";
import { decodeByteArrayToData } from "@/ld2410/decode";

type ReadResult =
	| { value: Uint8Array; done: false }
	| { value: undefined; done: true };

export type SerialConnectionError =
	| "DEVICE_REQUEST_FAILURE"
	| "PORT_OPEN_FAILURE";

export class SerialCommunicationClient implements CommunicationClient {
	private rxSubject = new Subject<Uint8Array>();
	private txSubject = new Subject<LD2410WritePayload>();
	private eventSubject = new Subject<CommunicationEvent>();
	public get events() {
		// Surface subject as observable for external read-only usage
		return this.eventSubject;
	}

	private port: SerialPort | undefined;
	private disconnecting = false;

	public async connect(
		baudRate: number,
	): Promise<Result<undefined, SerialConnectionError>> {
		console.log("Requesting serial device");
		try {
			this.port = await navigator.serial.requestPort();
		} catch (error) {
			console.error("Requesting serial device failed", error);
			return Result.error("DEVICE_REQUEST_FAILURE");
		}

		console.log(`Opening serial port with baud rate ${baudRate}`);
		try {
			await this.port.open({ baudRate, parity: "none", stopBits: 1 });
		} catch (error) {
			console.error("Opening serial port failed", error);
			return Result.error("PORT_OPEN_FAILURE");
		}

		this.txSubject.pipe(rateLimit(200)).subscribe({
			next: (payload) => {
				if (this.port == null) {
					throw new Error("Port is null");
				}
				const bytes = encodePayloadToByteArray(payload);

				const writer = this.port.writable.getWriter();
				try {
					writer.write(bytes);
					this.eventSubject.next({
						type: "TX",
						bytes,
						payload,
					});
				} catch (error) {
					console.error("Failed to write bytes to serial", error);
				} finally {
					writer.releaseLock();
				}
			},
		});

		this.rxSubject
			.pipe(
				// Combine bytes received in short timespan
				bufferDebounce(3),
				map(concatUint8Arrays),
				// Ignore empty sequences of bytes (probably impossible to happen)
				filter((bytes) => bytes.length > 0),
				map(
					(bytes): RxEvent => ({
						type: "RX",
						bytes,
						payload: decodeByteArrayToData(bytes),
					}),
				),
			)
			.subscribe(this.eventSubject);

		this.readForever();

		return Result.ok(undefined);
	}

	async readForever() {
		if (this.port == null) {
			console.error("Attempted to read serial without a port");
			return;
		}

		while (!this.disconnecting && this.port.readable != null) {
			console.log("Getting serial reader");
			const reader = this.port.readable.getReader();

			try {
				while (!this.disconnecting) {
					const result: ReadResult = await reader.read();
					const { done, value } = result;

					if (done) {
						break;
					}

					this.rxSubject.next(value);
				}
			} catch (error) {
				console.error("Serial read encountered error", error);
				this.rxSubject.error("Serial read encountered error");
			} finally {
				console.log("Releasing serial reader lock");
				reader.releaseLock();
			}
		}

		console.log("Serial reading done");
		if (!this.disconnecting) {
			console.error("Serial read encountered unexpected disconnection");
		}

		await this.port?.close();
		this.port = undefined;

		this.rxSubject.complete();
		this.txSubject.complete();
	}

	public async queueTxPayload(payload: LD2410WritePayload) {
		this.txSubject.next(payload);
	}

	public async disconnect(): Promise<void> {
		console.log("Disconnecting from serial device");
		this.disconnecting = true;

		console.log("Waiting for read to complete");
		await lastValueFrom(this.rxSubject.pipe(timeout(5_000)));
		console.log("Reading completed");

		this.disconnecting = false;
	}
}
