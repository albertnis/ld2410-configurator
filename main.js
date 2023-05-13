let ports = [];

const bootstrap = async () => {
  navigator.serial.addEventListener("connect", (e) => {
    ports = [...ports, e.target];
  });

  navigator.serial.addEventListener("disconnect", (e) => {
    ports = ports.filter((p) => p !== e.target);
  });

  ports = await navigator.serial.getPorts();
  console.log("Ports are, ", ports);
};

window.addEventListener("load", () => {
  const rootElement = document.getElementById("root");
  if (navigator.serial == null) {
    rootElement.innerHTML = "Does not support serial";
  } else {
    bootstrap();
  }
});

let stopping = false;

if (navigator.serial !== null) {
  document.getElementById("stop").addEventListener("click", () => {
    stopping = true;
  });

  document.getElementById("load").addEventListener("click", async () => {
    const port = await navigator.serial.requestPort();
    ports = [...ports, port];

    console.log("Ports are, ", ports);

    const output = document.getElementById("output");

    await port.open({ baudRate: 256_000, parity: "none", stopBits: 1 });
    output.innerHTML += "Port opened\n";
    let inputBytes = [];

    while (port.readable) {
      const reader = port.readable.getReader();

      try {
        const { value, done } = await reader.read();
        console.log(value);
        if (done || stopping) {
          break;
        }

        const vals = Array.from(value);

        vals.forEach((v) => {
          inputBytes.push(v);
          if (
            v === 0xf5 &&
            inputBytes.at(-2) === 0xf6 &&
            inputBytes.at(-3) === 0xf7 &&
            inputBytes.at(-4) === 0xf8
          ) {
            const hex = inputBytes
              .map((b) => b.toString(16).padStart(2, "0"))
              .join(" ");

            output.innerHTML += `${hex}\n`;
            window.scrollTo(0, document.body.scrollHeight);
            inputBytes = [];
          }
        });
      } finally {
        reader.releaseLock();
        output.innerHTML += `---\n`;
      }
    }

    await port.close();
    output.innerHTML += "Port closed\n";
  });
}
