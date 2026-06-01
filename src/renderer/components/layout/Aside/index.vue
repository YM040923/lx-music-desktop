<template>
  <div :class="[$style.aside, { [$style.fullscreen]: isFullscreen }]">
    <ControlBtns v-if="appSetting['common.controlBtnPosition'] == 'left'" />
    <div v-else :class="$style.brand">
      <div :class="$style.logoMark">YM</div>
    </div>
    <NavBar :class="$style.nav" />
  </div>
</template>

<script setup>
import { isFullscreen } from '@renderer/store'
import { appSetting } from '@renderer/store/setting'

import ControlBtns from './ControlBtns.vue'
import NavBar from './NavBar.vue'

</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.aside {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  gap: 12px;
  padding: 16px 10px 16px;
  background-color: rgba(255, 255, 255, .42);
  backdrop-filter: blur(28px) saturate(1.12);
  -webkit-backdrop-filter: blur(28px) saturate(1.12);
  transition: background-color @transition-normal;

  &.fullscreen {
    -webkit-app-region: no-drag;
    .brand { display: none; }
  }
}

.brand {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0 4px;
}

.logoMark {
  width: 40px;
  height: 40px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark-200));
  box-shadow: 0 4px 14px var(--color-primary-alpha-400);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  transition: transform @transition-fast, box-shadow @transition-fast;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px var(--color-primary-alpha-500);
  }
}

.nav {
  min-height: 0;
  flex: auto;
}

</style>
