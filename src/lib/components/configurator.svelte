<script lang="ts">
  import type { SerialStore } from "$lib/stores/serialRead";
  import Console from "./console.svelte";
  import OutputView from "./outputView.svelte";
  import Parameters from "./parameters.svelte";

  export let serialStore: SerialStore;
</script>

<button
  class="bg-red-600 border rounded-sm border-red-500 hover:bg-red-500 active:bg-red-700 px-2 py-1"
  on:click={() => serialStore.disconnect()}>Disconnect</button
>

<OutputView {serialStore} />

<Parameters {serialStore} />

<Console {serialStore} />
