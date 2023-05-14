<script lang="ts">
  export let openPort: (br: number) => Promise<void>;

  const baudRates = [9600, 19200, 38400, 57600, 115200, 230400, 256000, 460800];
  let baudRate = 256000;

  let showAdvanced = false;

  const onClick = async () => {
    openPort(baudRate);
  };
</script>

Configurator is disconnected

<form>
  <div>
    <input
      id="connection-form-advanced"
      name="advanced"
      type="checkbox"
      bind:checked={showAdvanced}
    />
    <label for="connection-form-advanced"
      >Display advanced connection options</label
    >
  </div>
  {#if showAdvanced}
    <div>
      <label for="connection-form-baudRate"
        >Baud rate (factory default is 256000)</label
      >
      <select
        id="connection-form-baudRate"
        name="baudRate"
        bind:value={baudRate}
      >
        {#each baudRates as br}
          <option value={br}>{br}</option>
        {/each}
      </select>
    </div>
  {/if}
  <button on:click={onClick}>Select port and connect...</button>
</form>
