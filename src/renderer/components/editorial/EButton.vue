<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 font-sans font-medium rounded-card-sm transition-all duration-200 outline-none cursor-pointer select-none',
      sizeClasses,
      variantClasses,
      $attrs.class,
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'accent', 'ghost', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
})

const sizeClasses = computed(() => ({
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-8 text-base',
}[props.size]))

const variantClasses = computed(() => ({
  primary: 'bg-accent text-white hover:bg-accent-hover active:scale-[0.97]',
  accent: 'bg-accent-gold text-bg-primary hover:brightness-110 active:scale-[0.97]',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary active:scale-[0.97]',
  outline: 'bg-transparent text-text-secondary border border-border-subtle hover:text-text-primary hover:border-text-muted active:scale-[0.97]',
}[props.variant]))
</script>
