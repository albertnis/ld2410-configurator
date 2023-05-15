<script lang="ts">
  import { decodeByteArrayToData } from "$lib/ld2410/decode";
  import type {
    RadarDataOutputBasicPayload,
    UnknownPayload,
  } from "$lib/ld2410/types";
  import type { SerialStore } from "$lib/stores/serialRead";
  import { onMount } from "svelte";

  export let serialStore: SerialStore;

  let state: RadarDataOutputBasicPayload | UnknownPayload = { type: "UNKNOWN" };

  onMount(() => {
    serialStore.subscribe((e) => {
      if (e.eventType === "READ") {
        const decoded = decodeByteArrayToData(e.payload);
        if (decoded.type === "RADAR_DATA_OUTPUT") {
          state = decoded;
        }
      }
    });
  });
</script>

<h2>Output</h2>

{#if state.type === "RADAR_DATA_OUTPUT"}
  <dl>
    <dt>Detection state</dt>
    <dd>{state.targetStatus}</dd>

    <dt>Detection distance</dt>
    <dd>{state.detectionDistanceCm}cm</dd>

    <dt>Movement target distance</dt>
    <dd>{state.movementTargetDistanceCm}cm</dd>

    <dt>Stationary target distance</dt>
    <dd>{state.stationaryTargetDistanceCm}cm</dd>
  </dl>
{:else}
  Unknown state
{/if}
