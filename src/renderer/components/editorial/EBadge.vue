<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-card-xs text-[11px] font-sans font-medium tracking-[0.03em] transition-colors duration-200"
    :class="variantClasses"
  >
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full mr-1.5" :class="dotColor" />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'accent', 'gold', 'sage', 'success', 'warning'].includes(v),
  },
  dot: { type: Boolean, default: false },
})

const variantClasses = computed(() => ({
  default: 'bg-bg-tertiary text-text-secondary',
  accent: 'bg-accent/15 text-accent',
  gold: 'bg-accent-gold/15 text-accent-gold',
  sage: 'bg-accent-sage/15 text-accent-sage',
  success: 'bg-green-500/15 text-green-400',
  warning: 'bg-yellow-500/15 text-yellow-400',
}[props.variant]))

const dotColor = computed(() => ({
  default: 'bg-text-muted',
  accent: 'bg-accent',
  gold: 'bg-accent-gold',
  sage: 'bg-accent-sage',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
}[props.variant]))
</script>
