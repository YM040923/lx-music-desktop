<template>
  <material-popup-btn ref="btn_ref" :class="[$style.btnContent, { [$style.playDetailContent]: props.playDetail }]">
    <button :class="props.playDetail ? $style.playDetailBtn : (props.buttonClass || $style.btn)" :aria-label="nextTogglePlayName">
      <svg
        v-if="appSetting['player.togglePlayMethod'] == 'listLoop'"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        height="80%" viewBox="0 0 24 24" space="preserve"
      >
        <use xlink:href="#icon-list-loop" />
      </svg>
      <svg
        v-else-if="appSetting['player.togglePlayMethod'] == 'random'"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        width="100%" viewBox="0 0 24 24" space="preserve"
      >
        <use xlink:href="#icon-list-random" />
      </svg>
      <svg
        v-else-if="appSetting['player.togglePlayMethod'] == 'list'"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        width="100%" viewBox="0 0 32 32" space="preserve"
      >
        <use xlink:href="#icon-list-order" />
      </svg>
      <svg
        v-else-if="appSetting['player.togglePlayMethod'] == 'singleLoop'"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        width="100%" viewBox="0 0 24 24" space="preserve"
      >
        <use xlink:href="#icon-single-loop" />
      </svg>
      <svg v-else version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 32 32" space="preserve">
        <use xlink:href="#icon-single" />
      </svg>
    </button>
    <template #content>
      <div :class="$style.setting">
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_list_loop')" @click="toggleMode('listLoop')">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 24 24" space="preserve">
            <use xlink:href="#icon-list-loop" />
          </svg>
        </button>
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_random')" @click="toggleMode('random')">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 24 24" space="preserve">
            <use xlink:href="#icon-list-random" />
          </svg>
        </button>
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_list')" @click="toggleMode('list')">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 32 32" space="preserve">
            <use xlink:href="#icon-list-order" />
          </svg>
        </button>
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_single_loop')" @click="toggleMode('singleLoop')">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 24 24" space="preserve">
            <use xlink:href="#icon-single-loop" />
          </svg>
        </button>
        <button :class="$style.btn" :aria-label="$t('player__play_toggle_mode_off')" @click="toggleMode('none')">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 32 32" space="preserve">
            <use xlink:href="#icon-single" />
          </svg>
        </button>
      </div>
    </template>
  </material-popup-btn>
</template>

<script setup>
import { ref } from '@common/utils/vueTools'
// import useNextTogglePlay from '@renderer/utils/compositions/useNextTogglePlay'
// import useToggleDesktopLyric from '@renderer/utils/compositions/useToggleDesktopLyric'
// import { musicInfo, playMusicInfo } from '@renderer/store/player/state'
import { appSetting } from '@renderer/store/setting'
import useNextTogglePlay from '@renderer/utils/compositions/useNextTogglePlay'

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

const btn_ref = ref(null)

const {
  nextTogglePlayName,
  toggleNextPlayMode,
} = useNextTogglePlay()

const toggleMode = (mode) => {
  btn_ref.value.hide()
  toggleNextPlayMode(mode)
}

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
  flex-flow: row nowrap;
  font-size: 14px;
  gap: 10px;
}


</style>
