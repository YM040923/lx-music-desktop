<template lang="pug">
div(:class="$style.header")
  div(ref="dom_btns" :class="$style.controBtn")
    button(type="button" :class="[$style.btn, $style.hide]" :aria-label="$t('player__hide_detail_tip')" ignore-tip :title="$t('player__hide_detail_tip')" @click="hide")
      svg(viewBox="0 0 30.727 30.727")
        use(xlink:href="#icon-window-hide")
    button(type="button" :class="[$style.btn, $style.fullscreenEnter]" :aria-label="$t('fullscreen')" ignore-tip :title="$t('fullscreen')" @click="fullscreenEnter")
      svg(viewBox="0 0 24 24")
        use(xlink:href="#icon-window-maximize-2")
    button(type="button" :class="[$style.btn, $style.fullscreenExit]" :aria-label="$t('fullscreen_exit')" ignore-tip :title="$t('fullscreen_exit')" @click="fullscreenExit")
      svg(viewBox="0 0 24 24")
        use(xlink:href="#icon-fullscreen-exit")
    button(type="button" :class="[$style.btn, $style.min]" :aria-label="$t('min')" ignore-tip :title="$t('min')" @click="minWindow")
      svg(viewBox="0 0 24 24")
        use(xlink:href="#icon-window-minimize-2")
    button(type="button" :class="[$style.btn, $style.close]" :aria-label="$t('close')" ignore-tip :title="$t('close')" @click="closeWindow")
      svg(viewBox="0 0 24 24")
        use(xlink:href="#icon-window-close-2")
</template>

<script setup lang="ts">
import { isFullscreen } from '@renderer/store'
import { setShowPlayerDetail } from '@renderer/store/player/action'
import { closeWindow, minWindow, setFullScreen } from '@renderer/utils/ipc'

const hide = () => { setShowPlayerDetail(false) }
const fullscreenEnter = () => {
  void setFullScreen(true).then((fullscreen) => {
    isFullscreen.value = fullscreen
  })
}
const fullscreenExit = () => {
  void setFullScreen(false).then((fullscreen) => {
    isFullscreen.value = fullscreen
  })
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

:global(.fullscreen) {
  .header {
    .controBtn {
      .close,
      .min,
      .fullscreenEnter {
        display: none;
      }

      .fullscreenExit {
        display: flex;
      }
    }
  }
}

.header {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 50;
  padding: 14px 16px;
  -webkit-app-region: no-drag;
}

.controBtn {
  display: flex;
  gap: 8px;
  align-items: center;
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
  background: rgba(255, 255, 255, .46);
  color: rgba(43, 58, 71, .66);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .54);
  transition: background-color 0.15s ease, color 0.15s ease;

  svg {
    width: 15px;
    height: 15px;
    fill: currentColor;
  }

  &:hover {
    background: rgba(255, 255, 255, .68);
    color: rgba(29, 43, 56, .88);
  }
}

.fullscreenExit {
  display: none;
}

.close {
  &:hover {
    background: rgba(255, 80, 60, 0.6);
    color: #fff;
  }
}
</style>
