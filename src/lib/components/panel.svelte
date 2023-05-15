<script lang="ts">
  export let title: string;
</script>

<div class="bg-gray-800 rounded-lg p-4">
  <h2 class="cursor-default mb-4 text-sm font-bold uppercase">{title}</h2>
  <slot />
</div>
