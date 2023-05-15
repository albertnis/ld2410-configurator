<script lang="ts">
  import { decodeByteArrayToData } from "$lib/ld2410/decode";
  import type {
    RadarDataOutputBasicPayload,
    UnknownPayload,
  } from "$lib/ld2410/types";
  import type { SerialStore } from "$lib/stores/serialRead";
  import { onMount } from "svelte";
  import Panel from "./panel.svelte";

  export let serialStore: SerialStore;

  const maxDistanceCm = 600;
  let state: RadarDataOutputBasicPayload | UnknownPayload = { type: "UNKNOWN" };

  let stationaryTargetDetected = false;
  let movementTargetDetected = false;

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

  $: {
    stationaryTargetDetected =
      state.type === "RADAR_DATA_OUTPUT" &&
      (state.targetStatus === "MOVEMENT_AND_STATIONARY_TARGET" ||
        state.targetStatus === "STATIONARY_TARGET");

    movementTargetDetected =
      state.type === "RADAR_DATA_OUTPUT" &&
      (state.targetStatus === "MOVEMENT_AND_STATIONARY_TARGET" ||
        state.targetStatus === "MOVEMENT_TARGET");
  }
</script>

<Panel title="Output" class="col-start-[col-1-start] col-end-[col-1-end]">
  {#if state.type === "RADAR_DATA_OUTPUT"}
    <dl>
      <dt class="inline uppercase text-xs text-gray-400">Target detection</dt>
      <dd class="hidden">{state.targetStatus}</dd>

      <div class="flex justify-around uppercase text-xs text-gray-400">
        <div
          class="py-2 px-4"
          class:bg-gray-500={state.targetStatus === "NO_TARGET"}
          class:text-white={state.targetStatus === "NO_TARGET"}
          class:font-bold={state.targetStatus === "NO_TARGET"}
        >
          None
        </div>
        <div
          class="py-2 px-4"
          class:bg-blue-500={stationaryTargetDetected}
          class:text-white={stationaryTargetDetected}
          class:font-bold={stationaryTargetDetected}
        >
          Stationary
        </div>
        <div
          class="py-2 px-4"
          class:bg-red-500={movementTargetDetected}
          class:text-white={movementTargetDetected}
          class:font-bold={movementTargetDetected}
        >
          Movement
        </div>
      </div>

      <dt class="mt-4 uppercase text-xs text-gray-400">Detection distance</dt>
      <dd>
        <span class="text-green-500 font-bold text-xl"
          >{state.detectionDistanceCm}</span
        >cm
      </dd>

      <div class="w-full relative border border-green-500 h-4">
        <div
          style={`width: ${(state.detectionDistanceCm / maxDistanceCm) * 100}%`}
          class="absolute top-[1px] left-[1px] right-[1px] bottom-[1px] bg-green-500"
        />
      </div>

      <dt class="mt-4 uppercase text-xs text-gray-400">
        Movement target distance
      </dt>
      <dd>
        <span class="text-red-500 font-bold text-xl"
          >{state.movementTargetDistanceCm}</span
        >cm
      </dd>

      <div class="w-full relative border border-red-500 h-4">
        <div
          style={`width: ${
            (state.movementTargetDistanceCm / maxDistanceCm) * 100
          }%`}
          class="absolute top-[1px] left-[1px] right-[1px] bottom-[1px] bg-red-500"
        />
      </div>

      <dt class="mt-4 uppercase text-xs text-gray-400">
        Stationary target distance
      </dt>
      <dd>
        <span class="text-blue-500 font-bold text-xl"
          >{state.stationaryTargetDistanceCm}</span
        >cm
      </dd>

      <div class="w-full relative border border-blue-500 h-4">
        <div
          style={`width: ${
            (state.stationaryTargetDistanceCm / maxDistanceCm) * 100
          }%`}
          class="absolute top-[1px] left-[1px] right-[1px] bottom-[1px] bg-blue-500"
        />
      </div>
    </dl>
  {:else}
    Unknown state
  {/if}
</Panel>
