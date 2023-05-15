<script lang="ts">
  import { decodeByteArrayToData } from "$lib/ld2410/decode";
  import { encodePayloadToByteArray } from "$lib/ld2410/encode";
  import type { Sensitivity } from "$lib/ld2410/types";
  import type { SerialStore } from "$lib/stores/serialRead";
  import { onMount } from "svelte";

  export let serialStore: SerialStore;
  let formElement: HTMLFormElement;

  let firmwareVerion: string | undefined = undefined;
  let macAddress: string | undefined = undefined;
  let protocolVersion: number | undefined = undefined;
  let bufferSize: number | undefined = undefined;

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
        if (payload.type === "READ_FIRMWARE_VERSION_ACK") {
          firmwareVerion = `${payload.majorVersion}.${payload.minorVersion}`;
        } else if (payload.type === "GET_MAC_ADDRESS_ACK") {
          macAddress = payload.macAddress;
        } else if (payload.type === "ENABLE_CONFIGURATION_COMMAND_ACK") {
          ({ protocolVersion, bufferSize } = payload);
        } else if (payload.type === "READ_PARAMETER_COMMAND_ACK") {
          console.log(payload);
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
</script>

<h2>Configuration Parameters</h2>

<button on:click={readAllParameters}>Reload all</button>

<h3>Diagnostics</h3>

<dl>
  <dt>Firmware version</dt>
  <dd>{firmwareVerion}</dd>

  <dt>Protocol version</dt>
  <dd>{protocolVersion}</dd>

  <dt>Buffer size</dt>
  <dd>{bufferSize}</dd>

  <dt>Mac address</dt>
  <dd>{macAddress}</dd>
</dl>

<h3>Configuration</h3>

<form bind:this={formElement}>
  <label>
    Timeout period:
    <input
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

  <label>
    Maximum moving distance gate:
    <input
      type="number"
      min="1"
      max="8"
      step="1"
      bind:value={maximumMovingDistanceGate}
      on:change={onTimeoutChange}
      required
    />
  </label>

  <label>
    Maximum static distance gate:
    <input
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
    <div>
      <h4>Gate 0</h4>
      <label>
        Motion sensitivity ({sensitivity[0].motion})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[0].motion}
        />
      </label>
      <label>
        Rest sensitivity ({sensitivity[0].rest})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          disabled
          bind:value={sensitivity[0].rest}
        />
      </label>
    </div>
    <div>
      <h4>Gate 1</h4>
      <label>
        Motion sensitivity ({sensitivity[1].motion})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[1].motion}
        />
      </label>
      <label>
        Rest sensitivity ({sensitivity[1].rest})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          disabled
          bind:value={sensitivity[1].rest}
        />
      </label>
    </div>
    <div>
      <h4>Gate 2</h4>
      <label>
        Motion sensitivity ({sensitivity[2].motion})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[2].motion}
        />
      </label>
      <label>
        Rest sensitivity ({sensitivity[2].rest})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[2].rest}
        />
      </label>
    </div>
    <div>
      <h4>Gate 3</h4>
      <label>
        Motion sensitivity ({sensitivity[3].motion})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[3].motion}
        />
      </label>
      <label>
        Rest sensitivity ({sensitivity[3].rest})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[3].rest}
        />
      </label>
    </div>
    <div>
      <h4>Gate 4</h4>
      <label>
        Motion sensitivity ({sensitivity[4].motion})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[4].motion}
        />
      </label>
      <label>
        Rest sensitivity ({sensitivity[4].rest})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[4].rest}
        />
      </label>
    </div>
    <div>
      <h4>Gate 5</h4>
      <label>
        Motion sensitivity ({sensitivity[5].motion})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[5].motion}
        />
      </label>
      <label>
        Rest sensitivity ({sensitivity[5].rest})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[5].rest}
        />
      </label>
    </div>
    <div>
      <h4>Gate 6</h4>
      <label>
        Motion sensitivity ({sensitivity[6].motion})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[6].motion}
        />
      </label>
      <label>
        Rest sensitivity ({sensitivity[6].rest})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[6].rest}
        />
      </label>
    </div>
    <div>
      <h4>Gate 7</h4>
      <label>
        Motion sensitivity ({sensitivity[7].motion})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[7].motion}
        />
      </label>
      <label>
        Rest sensitivity ({sensitivity[7].rest})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[7].rest}
        />
      </label>
    </div>
    <div>
      <h4>Gate 8</h4>
      <label>
        Motion sensitivity ({sensitivity[8].motion})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[8].motion}
        />
      </label>
      <label>
        Rest sensitivity ({sensitivity[8].rest})
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={sensitivity[8].rest}
        />
      </label>
    </div>
  {/if}
</form>
