<script lang="ts">
  import Panel from "./panel.svelte";

  export let openPort: (br: number) => Promise<void>;

  const baudRates = [9600, 19200, 38400, 57600, 115200, 230400, 256000, 460800];
  let baudRate = 256000;

  let showAdvanced = false;

  const onClick = async () => {
    openPort(baudRate);
  };
</script>

<Panel
  title="Connection Options"
  class="col-start-[col-1-start] col-end-[col-2-end]"
>
  <p>Welcome to LD2410 Configurator! Here are some steps to get started:</p>
  <ol class="list-decimal list-inside">
    <li>Connect your LD2410 to a serial adapter such as a CP2102</li>
    <li>Plug your serial adapter into your computer</li>
    <li>Click the button below to connect!</li>
  </ol>

  <form class="mt-4">
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
          class="text-black"
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
    <button
      class="hover:bg-blue-500 active:bg-blue-700 bg-blue-600 border rounded-sm border-blue-500 px-2 py-1"
      on:click={onClick}>Select port and connect...</button
    >
  </form>
</Panel>
