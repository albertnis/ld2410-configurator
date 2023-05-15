<script lang="ts">
  import { onMount } from "svelte";
  import Unsupported from "../lib/components/unsupported.svelte";
  import App from "$lib/components/app.svelte";

  let supported: boolean | "unknown" = "unknown";

  onMount(() => {
    supported = navigator.serial != null;
  });
</script>

<h1>LD2410 Configurator</h1>

{#if supported === "unknown"}
  <span>Checking browser compatibility</span>
{:else if supported}
  <App />
{:else}
  <Unsupported />
{/if}
