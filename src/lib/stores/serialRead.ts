type SubscribeCallback = (value: Uint8Array) => void;

interface Store {
  subscribe: (subscription: SubscribeCallback) => () => void;
}

export type SerialStore = Store & {
  connect: () => void;
  disconnect: () => void;
};

type ReadResult =
  | { value: Uint8Array; done: false }
  | { value: undefined; done: true };

export const createSerialReadStore = (
  port: SerialPort,
  baudRate: number
): SerialStore => {
  let _val = new Uint8Array();

  let stopping = false;
  const subs: SubscribeCallback[] = [];

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
              _val = new Uint8Array(inputBytes);
              subs.forEach((fn) => fn(_val));
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
  };

  const connect = async () => {
    await port.open({ baudRate, parity: "none", stopBits: 1 });
    readForever();
  };

  const disconnect = async () => {
    stopping = true;
  };

  const subscribe = (cb: SubscribeCallback) => {
    subs.push(cb);
    cb(_val);

    return () => {
      const index = subs.findIndex((fn) => fn === cb);
      subs.splice(index, 1);
    };
  };

  return { connect, disconnect, subscribe };
};
