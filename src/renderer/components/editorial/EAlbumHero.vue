<template>
  <div class="relative overflow-hidden rounded-card group cursor-pointer" :class="sizeClass">
    <!-- Cover image -->
    <div class="relative w-full overflow-hidden rounded-card">
      <img
        v-if="cover"
        :src="cover"
        class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
        @error="$event.target.style.display='none'"
      />
      <div v-else class="w-full aspect-square bg-bg-tertiary flex items-center justify-center text-text-muted">
        <svg class="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>

      <!-- Gradient overlay at bottom -->
      <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent rounded-b-card" />

      <!-- Info overlay -->
      <div class="absolute inset-x-0 bottom-0 p-5">
        <div v-if="label" class="text-[10px] text-white/60 font-sans tracking-[0.1em] uppercase mb-1">
          {{ label }}
        </div>
        <h2 v-if="title" class="font-serif text-[20px] font-medium text-white leading-snug line-clamp-2">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-xs text-white/70 mt-1 font-sans line-clamp-1">
          {{ subtitle }}
        </p>
      </div>

      <!-- Play button overlay on hover -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
        <div class="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-[0_4px_20px_rgba(255,94,91,0.5)] transform group-hover:scale-100 scale-90 transition-transform duration-300">
          <svg class="w-6 h-6 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cover: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  label: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'hero'].includes(v),
  },
})

const sizeClass = computed(() => ({
  sm: 'col-span-3',
  md: 'col-span-4',
  lg: 'col-span-6',
  hero: 'col-span-8',
}[props.size]))
</script>
