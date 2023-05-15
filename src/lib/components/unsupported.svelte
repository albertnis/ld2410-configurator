<script lang="ts">
  import Panel from "./panel.svelte";
</script>

<Panel
  title="Incompatible Browser"
  class="col-start-[col-1-start] col-end-[col-2-end]"
>
  <div>Not supported on this browser</div>
  <div>
    <a
      class="underline"
      href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility"
      >View browser compatibility on MDN</a
    >
  </div>
</Panel>
