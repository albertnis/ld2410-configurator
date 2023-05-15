<script lang="ts">
  export let title: string;
  let className: string = "";
  export { className as class };
</script>

<div class={`bg-gray-800 rounded-xl p-4 ${className}`}>
  <h2 class="cursor-default mb-4 text-sm font-bold uppercase">{title}</h2>
  <slot />
</div>
