<script lang="ts">
  import { decodeByteArrayToData } from "$lib/ld2410/decode";
  import { encodePayloadToByteArray } from "$lib/ld2410/encode";
  import type { SerialStore } from "$lib/stores/serialRead";
  import { onMount } from "svelte";

  export let serialStore: SerialStore;

  let configurationMode: boolean | undefined = undefined;
  let firmwareVerion: string | undefined = undefined;
  let macAddress: string | undefined = undefined;

  const enterConfigurationMode = () => {
    serialStore.write(
      encodePayloadToByteArray({ type: "ENABLE_CONFIGURATION_COMMAND" })
    );
  };

  const exitConfigurationMode = () => {
    serialStore.write(
      encodePayloadToByteArray({ type: "END_CONFIGURATION_COMMAND" })
    );
  };

  const getFirmwareVersion = () => {
    serialStore.write(
      encodePayloadToByteArray({ type: "READ_FIRMWARE_VERSION" })
    );
  };

  const getMacAddress = () => {
    serialStore.write(encodePayloadToByteArray({ type: "GET_MAC_ADDRESS" }));
  };

  onMount(() => {
    serialStore.subscribe((e) => {
      if (e.eventType === "READ") {
        const payload = decodeByteArrayToData(e.payload);
        if (payload.type === "READ_FIRMWARE_VERSION_ACK") {
          firmwareVerion = `${payload.majorVersion}.${payload.minorVersion}`;
        } else if (payload.type === "GET_MAC_ADDRESS_ACK") {
          macAddress = payload.macAddress;
        } else if (payload.type === "ENABLE_CONFIGURATION_COMMAND_ACK") {
          configurationMode = true;
        } else if (payload.type === "END_CONFIGURATION_COMMAND_ACK") {
          configurationMode = false;
        }
      }
    });

    enterConfigurationMode();
    getFirmwareVersion();
    getMacAddress();
    exitConfigurationMode();
  });
</script>

<h2>Configuration Parameters</h2>

<button disabled={configurationMode === true} on:click={enterConfigurationMode}
  >Enter configuration mode</button
>
<button disabled={configurationMode === false} on:click={exitConfigurationMode}
  >Exit configuration mode</button
>

<dl>
  <button disabled={configurationMode === false} on:click={getFirmwareVersion}
    >Get firmware version</button
  >
  <dt>Firmware version</dt>
  <dd>{firmwareVerion}</dd>

  <button disabled={configurationMode === false} on:click={getMacAddress}
    >Get MAC address</button
  >
  <dt>Mac address</dt>
  <dd>{macAddress}</dd>
</dl>
