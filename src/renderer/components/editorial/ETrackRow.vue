<template>
  <div
    class="flex items-center gap-3 px-3 py-2.5 rounded-card-sm transition-all duration-200 group cursor-pointer select-none border border-transparent"
    :class="[
      isActive ? 'bg-accent/8 border-accent/15' : 'hover:bg-bg-tertiary/60',
      index % 2 === 0 ? 'bg-bg-secondary/30' : '',
    ]"
    @click="$emit('click')"
    @dblclick="$emit('dblclick')"
  >
    <!-- Row number or index -->
    <div class="w-8 flex-none text-right font-mono text-xs text-text-muted tabular-nums">
      <span v-if="isActive && playing" class="text-accent">
        <svg class="inline-block w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="4" height="12" rx="1" />
          <rect x="10" y="2" width="4" height="12" rx="1" />
        </svg>
      </span>
      <span v-else>{{ index + 1 }}</span>
    </div>

    <!-- Album art thumbnail -->
    <div class="w-10 h-10 flex-none rounded-card-xs overflow-hidden bg-bg-tertiary">
      <img v-if="cover" :src="cover" class="w-full h-full object-cover" @error="$event.target.style.display='none'" />
      <div v-else class="w-full h-full flex items-center justify-center text-text-muted">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>
    </div>

    <!-- Track info -->
    <div class="flex-1 min-w-0">
      <div class="text-sm font-medium text-text-primary truncate" :class="{ 'text-accent': isActive }">
        {{ title }}
      </div>
      <div class="text-xs text-text-muted truncate mt-0.5">
        {{ artist }}
      </div>
    </div>

    <!-- Album name -->
    <div v-if="album" class="hidden md:block text-xs text-text-muted truncate max-w-[120px]">
      {{ album }}
    </div>

    <!-- Duration -->
    <div class="flex-none font-mono text-xs text-text-muted tabular-nums w-12 text-right">
      {{ duration }}
    </div>

    <!-- Action slot -->
    <div v-if="$slots.actions" class="flex-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  index: { type: Number, default: 0 },
  title: { type: String, default: '' },
  artist: { type: String, default: '' },
  album: { type: String, default: '' },
  cover: { type: String, default: '' },
  duration: { type: String, default: '' },
  isActive: { type: Boolean, default: false },
  playing: { type: Boolean, default: false },
})

defineEmits(['click', 'dblclick'])
</script>
