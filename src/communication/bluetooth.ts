import { encodePayloadToByteArray } from "@/ld2410/encode";
import { Result } from "@/types";
import { type CommunicationEvent, type CommunicationClient } from ".";
import { Subject } from "rxjs";
import type { LD2410WritePayload } from "@/ld2410/types";
import { decodeByteArrayToData } from "@/ld2410/decode";
import { rateLimit } from "@/operators/bufferDebounce";

export type BluetoothConnectionError =
  | "DEVICE_REQUEST_FAILURE"
  | "DEVICE_NOT_GATT"
  | "GATT_CONNECT_FAILURE"
  | "GATT_SERVICE_FAILURE"
  | "LOGIN_FAILURE";

interface GattCharacteristics {
  send: BluetoothRemoteGATTCharacteristic;
  receive: BluetoothRemoteGATTCharacteristic;
}

/** Short number form of "app send" feature UUID in LD2410B datasheet */
const CHARACTERISTIC_SEND_ID = 0xfff2;

/** Short number form of "app receive" feature UUID in LD2410B datasheet */
const CHARACTERISTIC_RECEIVE_ID = 0xfff1;

export class BluetoothCommunicationClient implements CommunicationClient {
  private txSubject = new Subject<LD2410WritePayload>();
  private eventSubject = new Subject<CommunicationEvent>();
  public get events() {
    // Surface subject as observable for external read-only usage
    return this.eventSubject;
  }

  private device: BluetoothDevice | undefined;
  private characteristics: GattCharacteristics | undefined;

  public async connect(): Promise<Result<undefined, BluetoothConnectionError>> {
    console.log("Requesting bluetooth device");
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            namePrefix: "HLK-LD2410",
          },
        ],
        optionalServices: [0xfff0, 0xae00],
      });
    } catch (error) {
      console.error("Requesting bluetooth device failed", error);
      return Result.error("DEVICE_REQUEST_FAILURE");
    }
    if (this.device.gatt == null) {
      console.error(
        "Requesting bluetooth device failed (device.gatt not defined)"
      );
      return Result.error("DEVICE_NOT_GATT");
    }

    console.log("Connecting to GATT");
    let server: BluetoothRemoteGATTServer;
    try {
      server = await this.device.gatt.connect();
    } catch (error) {
      console.error("Connecting to GATT failed", error);
      return Result.error("GATT_CONNECT_FAILURE");
    }

    console.log("Retrieving GATT characteristics");
    try {
      const service = await server.getPrimaryService(0xfff0);
      this.characteristics = {
        send: await service.getCharacteristic(CHARACTERISTIC_SEND_ID),
        receive: await service.getCharacteristic(CHARACTERISTIC_RECEIVE_ID),
      };
    } catch (error) {
      console.error("Retrieving GATT characteristics failed", error);
      await this.disconnect();
      await this.device.forget();
      return Result.error("GATT_SERVICE_FAILURE");
    }

    console.log("Subscribing to GATT receive events");
    this.characteristics.receive.startNotifications();
    this.characteristics.receive.addEventListener(
      "characteristicvaluechanged",
      (event) => {
        // @ts-expect-error
        const bytes = new Uint8Array(event.target.value.buffer);
        this.eventSubject.next({
          type: "RX",
          bytes,
          payload: decodeByteArrayToData(bytes),
        });
      }
    );

    this.txSubject.pipe(rateLimit(200)).subscribe({
      next: async (payload) => {
        if (this.characteristics == null) {
          throw new Error("Characteristics are null");
        }

        const bytes = encodePayloadToByteArray(payload);

        try {
          await this.characteristics.send.writeValue(bytes);
          this.eventSubject.next({
            type: "TX",
            bytes,
            payload,
          });
        } catch (error) {
          this.eventSubject.error(error);
        }
      },
    });

    return Result.ok(undefined);
  }

  public queueTxPayload(payload: LD2410WritePayload) {
    this.txSubject.next(payload);
  }

  public async disconnect() {
    console.log("Disconnecting from Bluetooth device");

    try {
      if (this.device?.gatt?.connected) {
        this.device.gatt.disconnect();
      }
    } catch (error) {
      this.eventSubject.error(error);
    } finally {
      this.device = undefined;
      this.characteristics = undefined;
      this.eventSubject.complete();
    }
  }
}
