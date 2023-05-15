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
};

export const createSerialReadStore = (
  port: SerialPort,
  baudRate: number
): SerialStore => {
  let stopping = false;
  const subs: SubscribeCallback[] = [];

  const broadcastEvent = (e: SerialEvent) => subs.forEach((cb) => cb(e));

  const write = async (payload: Uint8Array) => {
    if (port.writable != null) {
      const writer = port.writable.getWriter();
      writer.write(payload);
      writer.releaseLock();
      broadcastEvent({ eventType: "WRITE", payload });
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
              v === 0xf5 &&
              inputBytes.at(-2) === 0xf6 &&
              inputBytes.at(-3) === 0xf7 &&
              inputBytes.at(-4) === 0xf8
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

  return { connect, disconnect, subscribe };
};
