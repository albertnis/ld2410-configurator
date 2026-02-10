import type {
  LD2410ReadPayload,
  LD2410WritePayload,
  RadarDataOutputTargetStatus,
  Sensitivity,
} from "./ld2410/types";
import {
  type CommunicationClient,
  type RxEvent,
  type TxEvent,
} from "./communication";
import {
  SerialCommunicationClient,
  type SerialConnectionError,
} from "./communication/serial";
import {
  BluetoothCommunicationClient,
  type BluetoothConnectionError,
} from "./communication/bluetooth";
import { filter, map, Observable, Subject, tap } from "rxjs";

export type ClientState = {
  supportedFeatures: {
    bluetooth: boolean;
    serial: boolean;
  };
  firmwareVersion: string;
  macAddress: string;
  maximumDistanceGate: number;
  maximumMovingDistanceGate: number;
  maximumStaticDistanceGate: number;
  sensitivity: Sensitivity;
  energy: Sensitivity;
  timeout: number;
  targetStatus: RadarDataOutputTargetStatus;
  movementTargetDistanceCm: number;
  movementTargetEnergy: number;
  stationaryTargetDistanceCm: number;
  stationaryTargetEnergy: number;
  detectionDistanceCm: number;
  protocolVersion: number;
};

export type ConnectionError = BluetoothConnectionError | SerialConnectionError;

export interface ConnectEvent {
  type: "CONNECT";
  connectionType: "bluetooth" | "serial";
}

export interface DisconnectEvent {
  type: "DISCONNECT";
}

export type ClientEvent = ConnectEvent | RxEvent | TxEvent | DisconnectEvent;

class Client {
  private eventSubject = new Subject<ClientEvent>();
  /**
   * Long-lived subject that persists across reconnections.
   * Not expected to close, even when the communication client closes (upon disconnection).
   */
  public get events(): Observable<ClientEvent> {
    // Surface subject as observable for external read-only usage
    return this.eventSubject;
  }

  private communicationClient: CommunicationClient | undefined;

  public async connectSerial(baudRate: number) {
    const serialClient = new SerialCommunicationClient();
    const result = await serialClient.connect(baudRate);
    if (!result.success) {
      return result;
    }

    this.registerCommunicationClient(serialClient);

    this.eventSubject.next({
      type: "CONNECT",
      connectionType: "serial",
    });

    await this.postConnectionSetup();

    return result;
  }

  public async connectBluetooth(password: string) {
    const bluetoothClient = new BluetoothCommunicationClient();
    const result = await bluetoothClient.connect();
    if (!result.success) {
      return result;
    }
    this.registerCommunicationClient(bluetoothClient);

    this.eventSubject.next({
      type: "CONNECT",
      connectionType: "bluetooth",
    });

    await this.sendCommand({
      type: "BLUETOOTH_LOGIN",
      password,
    });

    await this.postConnectionSetup();

    return result;
  }

  /** Setup subscriptions for a communication client */
  private registerCommunicationClient(
    communicationClient: CommunicationClient
  ) {
    this.eventSubject
      .pipe(
        filter((x) => x.type === "RX"),
        map((x) => x.payload),
        map(clientStateUpdateFromReadPayload)
      )
      .subscribe(stateUpdates);

    this.communicationClient = communicationClient;
    this.communicationClient.events.subscribe({
      next: (event) => {
        this.eventSubject.next(event);
      },
      complete: () => {
        this.eventSubject.next({
          type: "DISCONNECT",
        });
      },
      error: (error) => {
        this.eventSubject.error(error);
      },
    });
  }

  /** Send initial commands common to all connection methods */
  private async postConnectionSetup() {
    await this.sendCommand({
      type: "ENABLE_CONFIGURATION_COMMAND",
    });

    await this.sendCommand({
      type: "ENGINEERING_MODE",
      enabled: true,
    });

    await this.sendCommand({
      type: "GET_MAC_ADDRESS",
    });

    await this.sendCommand({
      type: "READ_FIRMWARE_VERSION",
    });

    await this.sendCommand({
      type: "READ_PARAMETER_COMMAND",
    });

    await this.sendCommand({
      type: "END_CONFIGURATION_COMMAND",
    });
  }

  public async sendCommand(command: LD2410WritePayload) {
    await this.communicationClient?.queueTxPayload(command);
  }

  public async disconnect() {
    await this.communicationClient?.disconnect();
  }
}

export const client = new Client();

export const stateUpdates = new Subject<Partial<ClientState>>();

function clientStateUpdateFromReadPayload(
  payload: LD2410ReadPayload
): Partial<ClientState> {
  switch (payload.type) {
    case "RADAR_DATA_OUTPUT": {
      return {
        targetStatus: payload.targetStatus,
        movementTargetDistanceCm: payload.movementTargetDistanceCm,
        movementTargetEnergy: payload.movementTargetEnergy,
        stationaryTargetDistanceCm: payload.stationaryTargetDistanceCm,
        stationaryTargetEnergy: payload.stationaryTargetEnergy,
        detectionDistanceCm: payload.detectionDistanceCm,
      };
    }
    case "RADAR_ENGINEERING_DATA_OUTPUT": {
      return {
        targetStatus: payload.targetStatus,
        movementTargetDistanceCm: payload.movementTargetDistanceCm,
        movementTargetEnergy: payload.movementTargetEnergy,
        stationaryTargetDistanceCm: payload.stationaryTargetDistanceCm,
        stationaryTargetEnergy: payload.stationaryTargetEnergy,
        detectionDistanceCm: payload.detectionDistanceCm,
        energy: payload.energy,
      };
    }
    case "ENABLE_CONFIGURATION_COMMAND_ACK": {
      return {
        protocolVersion: payload.protocolVersion,
      };
    }
    case "READ_FIRMWARE_VERSION_ACK": {
      return {
        firmwareVersion: `${payload.majorVersion}.${payload.minorVersion}`,
      };
    }
    case "GET_MAC_ADDRESS_ACK": {
      return {
        macAddress: payload.macAddress,
      };
    }
    case "READ_PARAMETER_COMMAND_ACK": {
      return {
        maximumDistanceGate: payload.maximumDistanceGate,
        maximumMovingDistanceGate: payload.maximumMovingDistanceGate,
        maximumStaticDistanceGate: payload.maximumStaticDistanceGate,
        sensitivity: payload.sensitivity,
        timeout: payload.timeout,
      };
    }
    default: {
      return {};
    }
  }
}
