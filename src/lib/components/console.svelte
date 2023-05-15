<script lang="ts">
  import type { SerialStore } from "$lib/stores/serialRead";
  import { onMount } from "svelte";

  export let serialStore: SerialStore;

  let codes: Uint8Array[] = [];
  let scrollToBottom: boolean = true;
  let outputDiv: HTMLDivElement;

  const codesToHex = (c: Uint8Array): string =>
    Array.from(c)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");

  onMount(() => {
    serialStore.subscribe((event) => {
      if (event.eventType === "READ") {
        codes = [...codes, event.payload].slice(-300);
        if (scrollToBottom) {
          outputDiv.scrollTop = outputDiv.scrollHeight;
        }
      }
    });
  });
</script>

<h2>Serial Console</h2>

<label>
  <input type="checkbox" bind:checked={scrollToBottom} />
  Keep scrolled to bottom
</label>

<div style="height: 300px; overflow: scroll" bind:this={outputDiv}>
  {#each codes as code}
    <div>{codesToHex(code)}</div>
  {/each}
</div>
