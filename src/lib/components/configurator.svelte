<script lang="ts">
  import type { SerialStore } from "$lib/stores/serialRead";
  import Console from "./console.svelte";
  import OutputView from "./outputView.svelte";
  import Parameters from "./parameters.svelte";

  export let serialStore: SerialStore;
</script>

<button on:click={() => serialStore.disconnect()}>Disconnect</button>

<OutputView {serialStore} />

<Parameters {serialStore} />

<Console {serialStore} />
