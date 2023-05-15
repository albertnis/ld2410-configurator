<script lang="ts">
  import { onMount } from "svelte";
  import Unsupported from "../lib/components/unsupported.svelte";
  import App from "$lib/components/app.svelte";
  import Panel from "$lib/components/panel.svelte";

  let supported: boolean | "unknown" = "unknown";

  onMount(() => {
    supported = navigator.serial != null;
  });
</script>

<h1 class="text-3xl font-black">LD2410 Configurator</h1>

{#if supported === "unknown"}
  <Panel title="Browser Compatibility">
    <span>Checking browser compatibility</span>
  </Panel>
{:else if supported}
  <App />
{:else}
  <Unsupported />
{/if}
