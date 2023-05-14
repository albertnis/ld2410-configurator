<script lang="ts">
  import { onMount } from "svelte";

  export let readableStream: ReadableStream;
  export let writeableStream: WritableStream;
  export let onDisconnect: () => Promise<void>;
  let stopping = false;
  let codes: string[] = [];

  const readForever = async () => {
    let inputBytes: number[] = [];
    while (true) {
      const reader = readableStream.getReader();
      try {
        const { value, done } = await reader.read();
        if (done || stopping) {
          break;
        }

        console.log({ value });

        const vals: number[] = Array.from(value);

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
            codes = [...codes, hex].slice(-100);
            window.scrollTo(0, document.body.scrollHeight);
            inputBytes = [];
          }
        });
      } finally {
        reader.releaseLock();
      }
    }

    onDisconnect();
  };

  onMount(() => {
    readForever();
  });
</script>

Hello

<button
  id="stop"
  style="position: fixed; top: 0; right: 0"
  on:click={() => (stopping = true)}
>
  Disconnect
</button>

{#each codes as code}
  <div>{code}</div>
{/each}
