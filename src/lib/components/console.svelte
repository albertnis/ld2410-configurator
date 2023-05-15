<script lang="ts">
  import type { SerialStore } from "$lib/stores/serialRead";
  import { onMount } from "svelte";

  export let serialStore: SerialStore;

  type Message = {
    direction: "READ" | "WRITE";
    payload: Uint8Array;
  };

  let codes: Message[] = [];
  let scrollToBottom: boolean = true;
  let outputDiv: HTMLDivElement;

  const codesToHex = (c: Uint8Array): string =>
    Array.from(c)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");

  onMount(() => {
    serialStore.subscribe((event) => {
      if (event.eventType === "READ") {
        const code: Message = {
          direction: "READ",
          payload: event.payload,
        };
        codes = [...codes, code].slice(-300);
      } else if (event.eventType === "WRITE") {
        const code: Message = {
          direction: "WRITE",
          payload: event.payload,
        };
        codes = [...codes, code].slice(-300);
      }
      if (scrollToBottom) {
        outputDiv.scrollTop = outputDiv.scrollHeight;
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
    <div>{code.direction}: {codesToHex(code.payload)}</div>
  {/each}
</div>
