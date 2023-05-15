<script lang="ts">
  import { decodeByteArrayToData } from "$lib/ld2410/decode";
  import type { SerialStore } from "$lib/stores/serialRead";
  import { onMount } from "svelte";

  export let serialStore: SerialStore;

  let firmwareVerion: string | undefined;
  let macAddress: string | undefined;
  let protocolVersion: number | undefined;
  onMount(() => {
    serialStore.subscribe((e) => {
      if (e.eventType === "READ") {
        const payload = decodeByteArrayToData(e.payload);
        if (payload.type === "READ_FIRMWARE_VERSION_ACK") {
          firmwareVerion = `${payload.majorVersion}.${payload.minorVersion}`;
        } else if (payload.type === "GET_MAC_ADDRESS_ACK") {
          macAddress = payload.macAddress;
        } else if (payload.type === "ENABLE_CONFIGURATION_COMMAND_ACK") {
          protocolVersion = payload.protocolVersion;
        }
      }
    });
  });
</script>

<div
  class="col-start-[col-2-start] col-end-[col-2-end] flex justify-end items-center"
>
  <dl class="flex flex-col items-end mr-4 text-sm">
    <div>
      <dt class="inline uppercase text-xs text-gray-400">Firmware version</dt>
      <dd class="inline font-bold">{firmwareVerion}</dd>
    </div>

    <div>
      <dt class="inline uppercase text-xs text-gray-400">Mac address</dt>
      <dd class="inline font-bold">{macAddress}</dd>
    </div>

    <div>
      <dt class="inline uppercase text-xs text-gray-400">Protocol version</dt>
      <dd class="inline font-bold">{protocolVersion}</dd>
    </div>
  </dl>

  <button
    class="bg-red-600 border rounded-sm border-red-500 hover:bg-red-500 active:bg-red-700 px-2 py-1"
    on:click={() => serialStore.disconnect()}>Disconnect</button
  >
</div>
