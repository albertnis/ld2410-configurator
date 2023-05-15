<script lang="ts">
  import type { SerialStore } from "$lib/stores/serialRead";
  import Console from "./console.svelte";
  import OutputView from "./outputView.svelte";
  import Parameters from "./parameters.svelte";

  export let serialStore: SerialStore;
</script>

<button
  id="stop"
  style="position: fixed; top: 0; right: 0"
  on:click={() => serialStore.disconnect()}
>
  Disconnect
</button>

<OutputView {serialStore} />

<Parameters {serialStore} />

<Console {serialStore} />
