<script lang="ts">
  import Configurator from "./configurator.svelte";
  import ConnectionScreen from "./connectionScreen.svelte";

  let port: SerialPort | null = null;

  let readableStream: ReadableStream | null = null;
  let writeableStream: WritableStream | null = null;

  const openPort = async (baudRate: number) => {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate, parity: "none", stopBits: 1 });
    readableStream = port.readable;
    writeableStream = port.writable;
  };

  const disconnect = async () => {
    readableStream = null;
    writeableStream = null;
    await port?.close();
    port = null;
  };
</script>

{#if readableStream != null && writeableStream != null}
  <Configurator {readableStream} {writeableStream} onDisconnect={disconnect} />
{:else}
  <ConnectionScreen {openPort} />
{/if}
