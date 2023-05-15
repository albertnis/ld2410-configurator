<script lang="ts">
  import {
    createSerialReadStore,
    type SerialStore,
  } from "$lib/stores/serialRead";
  import Configurator from "./configurator.svelte";
  import ConnectionScreen from "./connectionScreen.svelte";

  let serialReadStore: SerialStore | null = null;

  const openPort = async (baudRate: number) => {
    const port = await navigator.serial.requestPort();
    serialReadStore = createSerialReadStore(port, baudRate);
    await serialReadStore.connect();
  };
</script>

{#if serialReadStore != null}
  <Configurator serialStore={serialReadStore} />
{:else}
  <ConnectionScreen {openPort} />
{/if}
