import { everyEqual } from "$lib/array/everyEqual";
import {
  configurationPayloadTrailer,
  radarDataOutputPayloadTrailer,
} from "$lib/ld2410/constants";

type ReadResult =
  | { value: Uint8Array; done: false }
  | { value: undefined; done: true };

interface ReadEvent {
  eventType: "READ";
  payload: Uint8Array;
}

interface WriteEvent {
  eventType: "WRITE";
  payload: Uint8Array;
}

interface ConnectEvent {
  eventType: "CONNECT";
}

interface SubscribedEvent {
  eventType: "SUBSCRIBED";
}

interface DisconnectEvent {
  eventType: "DISCONNECT";
}

type SerialEvent =
  | ReadEvent
  | WriteEvent
  | ConnectEvent
  | DisconnectEvent
  | SubscribedEvent;

type SubscribeCallback = (value: SerialEvent) => void;

interface Store {
  subscribe: (subscription: SubscribeCallback) => () => void;
}

export type SerialStore = Store & {
  connect: () => void;
  disconnect: () => void;
  write: (payload: Uint8Array) => void;
};

export const createSerialReadStore = (
  port: SerialPort,
  baudRate: number
): SerialStore => {
  let stopping = false;
  const subs: SubscribeCallback[] = [];
  const writeQueue: Uint8Array[] = [];

  const broadcastEvent = (e: SerialEvent) => subs.forEach((cb) => cb(e));

  const write = async (payload: Uint8Array) => {
    writeQueue.push(payload);
  };

  const writeForever = async () => {
    while (!stopping && port.writable != null) {
      const writer = port.writable.getWriter();
      try {
        while (!stopping && writeQueue.length > 0) {
          const payload = writeQueue.shift()!;
          writer.write(payload);
          broadcastEvent({ eventType: "WRITE", payload });
        }
      } finally {
        writer.releaseLock();
      }
      await new Promise((x) => setTimeout(x, 100));
    }
  };

  const readForever = async () => {
    while (!stopping && port.readable != null) {
      const reader = port.readable.getReader();
      let inputBytes: number[] = [];
      try {
        while (!stopping) {
          const result: ReadResult = await reader.read();
          const { done, value } = result;

          if (done) {
            break;
          }

          value.forEach((v) => {
            inputBytes.push(v);
            if (
              everyEqual(inputBytes.slice(-4), radarDataOutputPayloadTrailer) ||
              everyEqual(inputBytes.slice(-4), configurationPayloadTrailer)
            ) {
              const payload = new Uint8Array(inputBytes);
              broadcastEvent({
                eventType: "READ",
                payload,
              });
              inputBytes = [];
            }
          });
        }
      } finally {
        reader.releaseLock();
      }
    }

    await port?.close();
    stopping = false;
    broadcastEvent({
      eventType: "DISCONNECT",
    });
  };

  const connect = async () => {
    await port.open({ baudRate, parity: "none", stopBits: 1 });
    readForever();
    writeForever();
    broadcastEvent({
      eventType: "CONNECT",
    });
  };

  const disconnect = async () => {
    stopping = true;
  };

  const subscribe = (cb: SubscribeCallback) => {
    subs.push(cb);
    cb({
      eventType: "SUBSCRIBED",
    });

    return () => {
      const index = subs.findIndex((fn) => fn === cb);
      subs.splice(index, 1);
    };
  };

  return { connect, write, disconnect, subscribe };
};
