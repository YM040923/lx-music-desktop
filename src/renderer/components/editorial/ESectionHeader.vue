<template>
  <div class="mb-8">
    <!-- Section number (print-inspired) -->
    <div v-if="number" class="section-number mb-1">
      {{ String(number).padStart(2, '0') }}
    </div>
    <!-- Title in serif -->
    <h2 class="font-serif text-[28px] font-medium text-text-primary leading-tight tracking-[-0.01em]">
      {{ title }}
    </h2>
    <!-- Subtitle in sans -->
    <p v-if="subtitle" class="mt-1.5 text-sm text-text-muted font-sans">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  number: { type: [Number, String], default: null },
})
</script>
