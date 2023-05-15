<script lang="ts">
  import { onMount } from "svelte";
  import Unsupported from "../lib/components/unsupported.svelte";
  import App from "$lib/components/app.svelte";
  import Panel from "$lib/components/panel.svelte";
  import Footer from "$lib/components/footer.svelte";

  let supported: boolean | "unknown" = "unknown";

  onMount(() => {
    supported = navigator.serial != null;
  });
</script>

<div class="col-start-[col-1-start] col-end-[col-1-end] flex items-center">
  <h1 class="text-3xl font-black">LD2410 Configurator</h1>
</div>

{#if supported === "unknown"}
  <Panel
    title="Browser Compatibility"
    class="col-start-[col-1-start] col-end-[col-1-end]"
  >
    <span>Checking browser compatibility</span>
  </Panel>
{:else if supported}
  <App />
{:else}
  <Unsupported />
{/if}

<div class="col-start-[col-1-start] col-end-[col-2-end]"><Footer /></div>
