<template>
  <div
    class="group relative overflow-hidden rounded-card bg-bg-secondary border border-border-subtle hover:border-border-subtle transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] cursor-pointer"
    :class="sizeClasses"
    v-bind="$attrs"
  >
    <!-- Image slot -->
    <div v-if="$slots.image" class="overflow-hidden">
      <slot name="image" />
    </div>
    <!-- Content -->
    <div class="p-4">
      <!-- Label above title -->
      <div v-if="label" class="text-[11px] text-text-muted font-sans tracking-[0.08em] uppercase mb-1">
        {{ label }}
      </div>
      <!-- Title -->
      <h3 class="font-serif text-lg font-medium text-text-primary leading-snug mb-1 line-clamp-2">
        {{ title }}
      </h3>
      <!-- Subtitle -->
      <p v-if="subtitle" class="text-sm text-text-secondary leading-relaxed line-clamp-1">
        {{ subtitle }}
      </p>
      <!-- Default slot for custom content -->
      <div v-if="$slots.default" class="mt-3">
        <slot />
      </div>
    </div>
    <!-- Hover overlay -->
    <div v-if="$slots.overlay" class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <slot name="overlay" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  label: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'hero'].includes(v),
  },
})

const sizeClasses = computed(() => ({
  sm: 'col-span-3',
  md: 'col-span-4',
  lg: 'col-span-6',
  hero: 'col-span-8',
}[props.size]))
</script>
