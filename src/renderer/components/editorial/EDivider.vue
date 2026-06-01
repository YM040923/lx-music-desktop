<template>
  <div class="flex items-center gap-3 py-4">
    <div class="h-px flex-1 bg-border-subtle" />
    <div v-if="label" class="text-[11px] text-text-muted font-sans tracking-[0.15em] uppercase whitespace-nowrap">
      {{ label }}
    </div>
    <div class="w-10 h-px bg-accent" />
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
})
</script>
