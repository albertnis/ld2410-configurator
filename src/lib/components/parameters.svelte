<script lang="ts">
  import { decodeByteArrayToData } from "$lib/ld2410/decode";
  import { encodePayloadToByteArray } from "$lib/ld2410/encode";
  import type { Sensitivity } from "$lib/ld2410/types";
  import type { SerialStore } from "$lib/stores/serialRead";
  import { onMount } from "svelte";
  import Panel from "./panel.svelte";

  export let serialStore: SerialStore;
  let formElement: HTMLFormElement;

  let firmwareVerion: string | undefined = undefined;
  let macAddress: string | undefined = undefined;

  let sensitivity: Sensitivity | undefined = undefined;
  let timeout: number | undefined = undefined;
  let maximumMovingDistanceGate: number | undefined = undefined;
  let maximumStaticDistanceGate: number | undefined = undefined;

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

  const readParameters = () => {
    serialStore.write(
      encodePayloadToByteArray({ type: "READ_PARAMETER_COMMAND" })
    );
  };


  const gates = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

  const onGateMotionSensitivityChange =
    (gate: (typeof gates)[number]) => (event: Event) => {
      if (sensitivity == null) {
        throw new Error("Sensitivity was not defined so could not be updated");
      }

      const target = event.target as HTMLInputElement;
      const motionSensitivity = parseInt(target.value);

      enterConfigurationMode();
      serialStore.write(
        encodePayloadToByteArray({
          type: "RANGE_GATE_SENSITIVITY",
          gate,
          motionSensitivity,
          staticSensitivity: sensitivity[gate].rest,
        })
      );
      exitConfigurationMode();
    };

  const onGateStaticSensitivityChange =
    (gate: (typeof gates)[number]) => (event: Event) => {
      if (sensitivity == null) {
        throw new Error("Sensitivity was not defined so could not be updated");
      }

      const target = event.target as HTMLInputElement;
      const staticSensitivity = parseInt(target.value);

      enterConfigurationMode();
      serialStore.write(
        encodePayloadToByteArray({
          type: "RANGE_GATE_SENSITIVITY",
          gate,
          motionSensitivity: sensitivity[gate].motion,
          staticSensitivity,
        })
      );
      exitConfigurationMode();
    };

  const readAllParameters = () => {
    enterConfigurationMode();
    getFirmwareVersion();
    getMacAddress();
    readParameters();
    exitConfigurationMode();
  };

  onMount(() => {
    serialStore.subscribe((e) => {
      if (e.eventType === "READ") {
        const payload = decodeByteArrayToData(e.payload);
        if (payload.type === "READ_PARAMETER_COMMAND_ACK") {
          ({
            sensitivity,
            timeout,
            maximumMovingDistanceGate,
            maximumStaticDistanceGate,
          } = payload);
        }
      }
    });

    readAllParameters();
  });

  const onTimeoutChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (
      maximumMovingDistanceGate == null ||
      maximumStaticDistanceGate == null ||
      timeout == null
    ) {
      throw Error("Not distance");
    }

    if (!target.validity.valid) {
      formElement.reportValidity();
      return;
    }

    enterConfigurationMode();
    serialStore.write(
      encodePayloadToByteArray({
        type: "MAXIMUM_DISTANCE_GATE",
        maximumMovingDistanceGate,
        maximumStaticDistanceGate,
        timeout,
      })
    );
    exitConfigurationMode();
  };

  const bluetoothOn = () => {
    enterConfigurationMode();
    serialStore.write(
      encodePayloadToByteArray({
        type: "BLUETOOTH",
        bluetooth: true,
      })
    );
    exitConfigurationMode();
    alert("reboot the Module");
  };

  const bluetoothOff = () => {
    enterConfigurationMode();
    serialStore.write(
      encodePayloadToByteArray({
        type: "BLUETOOTH",
        bluetooth: false,
      })
    );
    exitConfigurationMode();
    alert("reboot the Module");
  };
</script>

<Panel
  title="Configuration Parameters"
  class="col-start-[col-2-start] col-end-[col-2-end]"
>
  <button
    class="hover:bg-blue-500 active:bg-blue-700 bg-blue-600 border rounded-sm border-blue-500 px-2 py-1"
    on:click={readAllParameters}>Reload all</button
  >

  <button
    class="hover:bg-blue-500 active:bg-blue-700 bg-blue-600 border rounded-sm border-blue-500 px-2 py-1"
    on:click={bluetoothOn}>Bluetooth ON</button
  >
  <button
    class="hover:bg-blue-500 active:bg-blue-700 bg-blue-600 border rounded-sm border-blue-500 px-2 py-1"
    on:click={bluetoothOff}>Bluetooth OFF</button
  >
  <form bind:this={formElement}>
    <label class="block">
      Timeout period:
      <input
        class="bg-transparent border-2 px-2 py-1 rounded border-gray-500"
        type="number"
        min="0"
        max="65535"
        step="1"
        bind:value={timeout}
        on:change={onTimeoutChange}
        required
      />
      s
    </label>

    <label class="block">
      Maximum moving distance gate:
      <input
        type="number"
        class="bg-transparent border-2 px-2 py-1 rounded border-gray-500"
        min="1"
        max="8"
        step="1"
        bind:value={maximumMovingDistanceGate}
        on:change={onTimeoutChange}
        required
      />
    </label>

    <label class="block">
      Maximum static distance gate:
      <input
        class="bg-transparent border-2 px-2 py-1 rounded border-gray-500"
        type="number"
        min="1"
        max="8"
        step="1"
        bind:value={maximumStaticDistanceGate}
        on:change={onTimeoutChange}
        required
      />
    </label>

    {#if sensitivity != null}
      <table class="border-separate [border-spacing:1rem]">
        <thead>
          <tr>
            <th />
            <th>Motion sensitivity</th>
            <th>Rest sensitivity</th>
          </tr>
        </thead>
        {#each gates as i}
          <tr>
            <td class="uppercase text-xs text-gray-400">Gate {i}</td>
            <td
              ><label class="flex flex-col items-center"
                ><span class="hidden">Gate {i} motion sensitivity</span><input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  bind:value={sensitivity[i].motion}
                  on:change={onGateMotionSensitivityChange(i)}
                />
                <div class="text-sm font-bold text-grey-100">
                  {sensitivity[i].motion}
                </div></label
              >
            </td>
            <td>
              <label class="flex flex-col items-center"
                ><span class="hidden">Gate {i} rest sensitivity</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  disabled={i === 0 || i === 1}
                  bind:value={sensitivity[i].rest}
                  on:change={onGateStaticSensitivityChange(i)}
                />
                <div class="text-sm font-bold text-grey-100">
                  {sensitivity[i].rest}
                </div></label
              >
            </td>
          </tr>
        {/each}
      </table>
    {/if}
  </form>
</Panel>
