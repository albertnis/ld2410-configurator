<script lang="ts">
  import { decodeByteArrayToData } from "$lib/ld2410/decode";
  import type { SerialStore } from "$lib/stores/serialRead";
  import { onMount } from "svelte";

  export let serialStore: SerialStore;
  let codes: Uint8Array[] = [];

  const codesToHex = (c: Uint8Array): string =>
    Array.from(c)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");

  onMount(() => {
    serialStore.subscribe((vals) => {
      codes = [...codes, vals].slice(-100);
    });
  });
</script>

Hello

<button
  id="stop"
  style="position: fixed; top: 0; right: 0"
  on:click={() => serialStore.disconnect()}
>
  Disconnect
</button>

{#each codes as code}
  <div>{codesToHex(code)} {JSON.stringify(decodeByteArrayToData(code))}</div>
{/each}
