<template>
  <material-popup-btn :class="[$style.btnContent, { [$style.playDetailContent]: props.playDetail }]">
    <button :class="props.playDetail ? $style.playDetailBtn : (props.buttonClass || $style.btn)" :aria-label="isMute ? $t('player__volume_muted') : `${$t('player__volume')}${parseInt(volume * 100)}%`" @wheel="handleWheel">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 24 24" space="preserve">
        <use :xlink:href="icon" />
      </svg>
    </button>
    <template #content>
      <div :class="$style.setting">
        <div :class="$style.info">
          <span>{{ Math.trunc(volume * 100) }}%</span>
          <base-checkbox
            id="player__volume_mute"
            :model-value="isMute"
            :label="$t('player__volume_mute_label')"
            @update:model-value="saveVolumeIsMute($event)"
          />
        </div>
        <base-slider-bar :class="$style.slider" :value="volume" :min="0" :max="1" :step="0.01" @change="handleUpdateVolume" />
      </div>
    </template>
  </material-popup-btn>
</template>

<script setup>
import { computed } from '@common/utils/vueTools'
// import useNextTogglePlay from '@renderer/utils/compositions/useNextTogglePlay'
// import useToggleDesktopLyric from '@renderer/utils/compositions/useToggleDesktopLyric'
// import { musicInfo, playMusicInfo } from '@renderer/store/player/state'
import { saveVolumeIsMute } from '@renderer/store/setting'
import { volume, isMute } from '@renderer/store/player/volume'

const props = defineProps({
  buttonClass: {
    type: String,
    default: '',
  },
  playDetail: {
    type: Boolean,
    default: false,
  },
})

const handleWheel = (event) => {
  window.app_event.setVolume(Math.round(volume.value * 100 + (-event.deltaY / 100 * 2)) / 100)
}

const handleUpdateVolume = (val) => {
  window.app_event.setVolume(val)
}

const icon = computed(() => {
  return isMute.value
    ? '#icon-volume-mute-outline'
    : volume.value == 0
      ? '#icon-volume-off-outline'
      : volume.value < 0.3
        ? '#icon-volume-low-outline'
        : volume.value < 0.7
          ? '#icon-volume-medium-outline'
          : '#icon-volume-high-outline'
})

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
.btnContent {
  flex: none;
  height: 100%;
}

.playDetailContent {
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  display: flex;
}

.btn {
  position: relative;
  color: var(--color-button-font);
  justify-content: center;
  align-items: center;
  transition: color @transition-normal;
  cursor: pointer;
  background-color: transparent;
  border: none;
  width: 24px;
  display: flex;
  flex-flow: column nowrap;
  padding: 0;

  svg {
    fill: currentColor;
    opacity: 1;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
  }
  &:hover {
    opacity: .8;
  }
  &:active {
    opacity: .6;
  }
}

.playDetailBtn {
  width: 38px;
  min-width: 38px;
  height: 38px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, .38);
  color: rgba(35, 54, 67, .72);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .52),
    0 10px 24px rgba(76, 103, 124, .12);
  transition:
    transform @transition-fast,
    background-color @transition-fast,
    color @transition-fast,
    box-shadow @transition-fast;

  svg {
    width: 21px !important;
    height: 21px !important;
    fill: currentColor;
    color: currentColor;
    opacity: 1 !important;
    filter: none;
  }

  &:hover {
    color: var(--color-primary);
    background: rgba(255, 255, 255, .58);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, .62),
      0 14px 28px rgba(76, 103, 124, .16);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(.96);
  }
}

.setting {
  display: flex;
  flex-flow: column nowrap;
  padding: 2px 3px;
  gap: 8px;
  width: 140px;
}

.info {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  span {
    line-height: 1.2;
  }
}

.slider {
  width: 100%;
}

</style>
