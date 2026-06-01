<template>
  <div :class="$style.footer">
    <div :class="$style.footerLeft">
      <control-btns />
      <div :class="$style.progressContainer">
        <div :class="$style.progressContent">
          <common-progress-bar
            :class-name="$style.progress"
            :progress="progress"
            :handle-transition-end="handleTransitionEnd"
            :is-active-transition="isActiveTransition"
          />
        </div>
      </div>
      <div :class="$style.timeLabel"><span :class="$style.status" style="margin-right: 15px">{{ status }}</span><span>{{ nowPlayTimeStr }}</span><span style="margin: 0 5px;">/</span><span>{{ maxPlayTimeStr }}</span></div>
    </div>
    <div :class="$style.playControl">
      <div :class="[$style.playBtn, $style.sidePlayBtn]" :aria-label="$t('player__prev')" @click="playPrev()">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 1024 1024" space="preserve">
          <use xlink:href="#icon-prevMusic" />
        </svg>
      </div>
      <div :class="[$style.playBtn, $style.mainPlayBtn, isPlay ? $style.playing : $style.paused]" :aria-label="isPlay ? $t('player__pause') : $t('player__play')" @click="togglePlay">
        <svg v-if="isPlay" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 1024 1024" space="preserve">
          <use xlink:href="#icon-pause" />
        </svg>
        <svg v-else version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 1024 1024" space="preserve">
          <use xlink:href="#icon-play" />
        </svg>
      </div>
      <div :class="[$style.playBtn, $style.sidePlayBtn]" :aria-label="$t('player__next')" @click="playNext()">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 1024 1024" space="preserve">
          <use xlink:href="#icon-nextMusic" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { playNext, playPrev, togglePlay } from '@renderer/core/player'
import { status, isPlay } from '@renderer/store/player/state'
import usePlayProgress from '@renderer/utils/compositions/usePlayProgress'

import ControlBtns from './components/ControlBtns.vue'

const {
  nowPlayTimeStr,
  maxPlayTimeStr,
  progress,
  isActiveTransition,
  handleTransitionEnd,
} = usePlayProgress()

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.footer {
  flex: 0 0 100px;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  color: rgba(34, 48, 61, .78);
  background: linear-gradient(0deg, rgba(255, 255, 255, .55), rgba(255, 255, 255, .08));
}
.footerLeft {
  flex: auto;
  display: flex;
  flex-flow: column nowrap;
  padding: 13px 13px 13px 30px;
  overflow: hidden;
}

.progressContainer {
  width: 100%;
  position: relative;
  padding: 3px 0;
}

.progressContent {
  position: relative;
  height: 16px;
  padding: 5px 0;
  width: 100%;
}
.progress {
  height: 100%;
}

.barTransition {
  transition-property: transform;
  transition-timing-function: ease-out;
  transition-duration: 0.2s;
}
.timeLabel {
  width: 100%;
  height: 18px;
  display: flex;
  color: rgba(43, 58, 71, .56);
  span {
    font-size: 13px;
  }
}
.status {
  flex: auto;
}

.playControl {
  flex: none;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  padding: 0 34px 0 22px;
  color: rgba(35, 54, 67, .7);
}
.playBtn {
  flex: none;
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 14px;
  background: rgba(255, 255, 255, .38);
  color: rgba(35, 54, 67, .72);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .52),
    0 10px 24px rgba(76, 103, 124, .12);
  transition: transform 0.16s ease, background-color 0.16s ease, box-shadow 0.16s ease;
  cursor: pointer;

  svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }
  &:hover {
    background: rgba(255, 255, 255, .58);
    color: var(--color-primary);
    transform: translateY(-1px);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, .62),
      0 14px 28px rgba(76, 103, 124, .16);
  }
  &:active {
    transform: translateY(0) scale(.96);
  }
}

.mainPlayBtn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: #fff;
  background: var(--color-primary);
  box-shadow:
    0 14px 34px var(--color-primary-alpha-700),
    inset 0 0 0 1px rgba(255, 255, 255, .34);

  svg {
    width: 27px;
    height: 27px;
  }

  &:hover {
    background: var(--color-primary);
    transform: translateY(-1px) scale(1.04);
  }
}

.paused svg {
  transform: translateX(1px);
}

.playing svg {
  transform: translateX(0);
}

</style>
