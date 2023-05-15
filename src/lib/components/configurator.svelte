<script lang="ts">
  import type { SerialStore } from "$lib/stores/serialRead";
  import Console from "./console.svelte";
  import Diagnostics from "./diagnostics.svelte";
  import OutputView from "./outputView.svelte";
  import Parameters from "./parameters.svelte";

  export let serialStore: SerialStore;
</script>

<Diagnostics {serialStore} />

<OutputView {serialStore} />

<Parameters {serialStore} />

<Console {serialStore} />
