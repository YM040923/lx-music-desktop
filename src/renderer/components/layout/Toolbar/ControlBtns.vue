<template>
  <div v-show="!isFullscreen" ref="dom_btns" :class="$style.control">
    <button type="button" :class="$style.btn" :aria-label="$t('min')" ignore-tip :title="$t('min')" @click="minWindow">
      <svg viewBox="0 0 24 24"><use xlink:href="#icon-window-minimize-2" /></svg>
    </button>
    <button type="button" :class="$style.btn" :aria-label="$t('max')" ignore-tip :title="$t('max')" @click="toggleMaxWindow">
      <svg viewBox="0 0 24 24"><use xlink:href="#icon-window-maximize-2" /></svg>
    </button>
    <button type="button" :class="[$style.btn, $style.closeBtn]" :aria-label="$t('close')" ignore-tip :title="$t('close')" @click="closeWindow">
      <svg viewBox="0 0 24 24"><use xlink:href="#icon-window-close-2" /></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { minWindow, toggleMaxWindow, closeWindow } from '@renderer/utils/ipc'
import { onMounted, onBeforeUnmount, ref, useCssModule } from '@common/utils/vueTools'
import { isFullscreen } from '@renderer/store'

const dom_btns = ref<HTMLElement>()

const cssModule = useCssModule()

const handle_focus = () => {
  if (!dom_btns.value) return
  for (const node of dom_btns.value.children) {
    if (node.tagName !== 'BUTTON') continue
    node.classList.remove(cssModule.hover)
  }
}
const getBtnEl = (el: HTMLElement | null): HTMLElement | null => {
  let depth = 0
  while (el && el.tagName !== 'BUTTON' && depth < 10) {
    el = el.parentNode as HTMLElement
    depth++
  }
  return el && el.tagName === 'BUTTON' ? el : null
}
const handle_mouseover = (event: MouseEvent) => {
  const btn = getBtnEl(event.target as HTMLElement)
  if (!btn) return
  btn.classList.add(cssModule.hover)
}
const handle_mouseout = (event: MouseEvent) => {
  const btn = getBtnEl(event.target as HTMLElement)
  if (!btn) return
  btn.classList.remove(cssModule.hover)
}

onMounted(() => {
  window.app_event.on('focus', handle_focus)
  dom_btns.value?.addEventListener('mouseover', handle_mouseover)
  dom_btns.value?.addEventListener('mouseout', handle_mouseout)
})
onBeforeUnmount(() => {
  window.app_event.off('focus', handle_focus)
  dom_btns.value?.removeEventListener('mouseover', handle_mouseover)
  dom_btns.value?.removeEventListener('mouseout', handle_mouseout)
})
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.control {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 6px;
  -webkit-app-region: no-drag;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  background: var(--color-primary-light-600-alpha-400);
  color: var(--color-font);
  transition: background-color 0.15s ease;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  &.hover {
    background-color: var(--color-primary);
    color: #fff;
  }
}

.closeBtn {
  background: var(--color-btn-close);
  color: #fff;

  &.hover {
    background-color: #d43838;
  }
}
</style>
