<template>
  <material-popup-btn :class="[$style.btnContent, { [$style.playDetailContent]: props.playDetail }]">
    <button :class="[props.playDetail ? $style.playDetailBtn : (props.buttonClass || $style.btn), { [$style.active]: playbackRate != 1 }]" :aria-label="`${$t('player__playback_rate')}${playbackRate}x`">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 24 24" space="preserve">
        <use xlink:href="#icon-plex" />
      </svg>
    </button>
    <template #content>
      <div :class="$style.setting">
        <div :class="$style.info">
          <span>{{ playbackRate.toFixed(2) }}x</span>
          <div :class="$style.control">
            <base-checkbox
              id="player__playback_preserves_pitch"
              :model-value="appSetting['player.preservesPitch']"
              :label="$t('player__playback_preserves_pitch')"
              @update:model-value="updatePreservesPitch"
            />
            <base-btn min @click="handleUpdatePlaybackRate(100)">{{ $t('player__playback_rate_reset_btn') }}</base-btn>
          </div>
        </div>
        <base-slider-bar :class="$style.slider" :value="playbackRate * 100" :min="50" :max="200" @change="handleUpdatePlaybackRate" />
      </div>
    </template>
  </material-popup-btn>
</template>

<script setup>
// import { computed } from '@common/utils/vueTools'
import { playbackRate } from '@renderer/store/player/playbackRate'
import { appSetting, updateSetting } from '@renderer/store/setting'

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

const handleUpdatePlaybackRate = (val) => {
  window.app_event.setPlaybackRate(Math.round(val) / 100)
}


const updatePreservesPitch = (enabled) => {
  updateSetting({ 'player.preservesPitch': enabled })
}

// const icon = computed(() => {
//   return playbackRate.value == 0
//     ? '#icon-volume-off-outline'
//     : playbackRate.value < 0.3
//       ? '#icon-volume-low-outline'
//       : playbackRate.value < 0.7
//         ? '#icon-volume-medium-outline'
//         : '#icon-volume-high-outline'
// })

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
  // color: var(--color-button-font);
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
    transition: opacity @transition-fast;
    opacity: .5;
    // filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
  }
  &:hover {
    svg {
      opacity: .9;
    }
  }
  &:active {
    svg {
      opacity: 1;
    }
  }

  &.active {
    svg {
      color: var(--color-primary);
      opacity: .8;
    }
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

  &.active {
    color: #fff;
    background: var(--color-primary);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, .28),
      0 14px 30px var(--color-primary-alpha-700);
  }
}

.setting {
  display: flex;
  flex-flow: column nowrap;
  padding: 2px 3px;
  gap: 8px;
  width: 300px;
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
.control {
  align-items: center;
  display: flex;
  gap: 10px;
}

.slider {
  width: 100%;
}


</style>
