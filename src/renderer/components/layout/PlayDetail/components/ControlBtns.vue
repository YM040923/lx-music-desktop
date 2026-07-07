<template lang="pug">
div(:class="$style.footerLeftControlBtns")
  button(:class="[$style.footerLeftControlBtn, $style.lrcBtn]" :aria-label="toggleDesktopLyricBtnTitle" @click="toggleDesktopLyric" @contextmenu="toggleLockDesktopLyric")
    svg(v-show="appSetting['desktopLyric.enable']" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="125%" viewBox="0 0 512 512" space="preserve")
      use(xlink:href="#icon-desktop-lyric-on")
    svg(v-show="!appSetting['desktopLyric.enable']" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="125%" viewBox="0 0 512 512" space="preserve")
      use(xlink:href="#icon-desktop-lyric-off")
  button(:class="[$style.footerLeftControlBtn, { [$style.active]: appSetting['player.audioVisualization'] }]" :aria-label="$t('audio_visualization')" @click="toggleAudioVisualization")
    svg(version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="95%" viewBox="0 0 24 24" space="preserve")
      use(xlink:href="#icon-audio-wave")
  button(:class="[$style.footerLeftControlBtn, { [$style.active]: isShowLrcSelectContent }]" :aria-label="$t('lyric__select')" @click="toggleVisibleLrc")
    svg(version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="95%" viewBox="0 0 24 24" space="preserve")
      use(xlink:href="#icon-text")
  button(:class="[$style.footerLeftControlBtn, {[$style.active]: isShowPlayComment}]" :aria-label="$t('comment__show')" @click="toggleVisibleComment")
    svg(version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="95%" viewBox="0 0 24 24" space="preserve")
      use(xlink:href="#icon-comment")
  common-sound-effect-btn(:button-class="$style.footerLeftControlBtn")
  common-playback-rate-btn(:button-class="$style.footerLeftControlBtn")
  common-volume-btn(:button-class="$style.footerLeftControlBtn")
  common-start-play-timer-btn(:button-class="$style.footerLeftControlBtn" @show="handleShowTimer")
  common-current-playlist-btn(:button-class="$style.footerLeftControlBtn" @show="handleShowPlaylist")
  common-toggle-play-mode-btn(:button-class="$style.footerLeftControlBtn")
  button(:class="$style.footerLeftControlBtn" :aria-label="$t('player__add_music_to')" @click="isShowAddMusicTo = true")
    svg(version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" space="preserve")
      use(xlink:href="#icon-add-2")
  common-list-add-modal(v-model:show="isShowAddMusicTo" :music-info="playMusicInfo.musicInfo")

</template>

<script>
import { ref } from '@common/utils/vueTools'
import { useI18n } from '@renderer/plugins/i18n'

import {
  isShowLrcSelectContent,
  isShowPlayComment,
  playMusicInfo,
} from '@renderer/store/player/state'
import {
  setShowPlayLrcSelectContentLrc,
  setShowPlayComment,
} from '@renderer/store/player/action'

import useNextTogglePlay from '@renderer/utils/compositions/useNextTogglePlay'
import useToggleDesktopLyric from '@renderer/utils/compositions/useToggleDesktopLyric'
import { dialog } from '@renderer/plugins/Dialog'
import { setMediaDeviceId } from '@renderer/plugins/player'
import { appSetting, saveMediaDeviceId, setEnableAudioVisualization } from '@renderer/store/setting'

export default {
  setup() {
    const t = useI18n()
    // const setting = useRefGetter('setting')
    // const setAudioVisualization = useCommit('setAudioVisualization')
    // const saveMediaDeviceId = useCommit('setMediaDeviceId')

    const toggleVisibleLrc = () => {
      const newValue = !isShowLrcSelectContent.value
      if (newValue) setShowPlayComment(false)
      setShowPlayLrcSelectContentLrc(newValue)
    }
    const toggleVisibleComment = () => {
      const newValue = !isShowPlayComment.value
      if (newValue) setShowPlayLrcSelectContentLrc(false)
      setShowPlayComment(newValue)
    }
    const handleShowPlaylist = () => {
      setShowPlayLrcSelectContentLrc(false)
      setShowPlayComment(false)
    }
    const handleShowTimer = () => {
      setShowPlayLrcSelectContentLrc(false)
      setShowPlayComment(false)
    }
    const {
      nextTogglePlayName,
      toggleNextPlayMode,
    } = useNextTogglePlay()

    const {
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
    } = useToggleDesktopLyric()

    const isShowAddMusicTo = ref(false)

    const toggleAudioVisualization = async() => {
      const newSetting = !appSetting['player.audioVisualization']
      if (newSetting && appSetting['player.mediaDeviceId'] != 'default') {
        const confirm = await dialog.confirm({
          message: t('setting__player_audio_visualization_tip'),
          cancelButtonText: t('cancel_button_text'),
          confirmButtonText: t('confirm_button_text'),
        })
        if (!confirm) return
        await setMediaDeviceId('default').catch(_ => _)
        saveMediaDeviceId('default')
      }
      setEnableAudioVisualization(newSetting)
    }

    return {
      appSetting,
      isShowLrcSelectContent,
      toggleVisibleLrc,
      isShowPlayComment,
      toggleVisibleComment,
      handleShowPlaylist,
      handleShowTimer,
      nextTogglePlayName,
      toggleNextPlayMode,
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
      toggleAudioVisualization,
      isShowAddMusicTo,
      playMusicInfo,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.footerLeftControlBtns {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;

  > * {
    flex: 0 0 38px;
    width: 38px;
    height: 38px;
  }

  > button,
  > * > button {
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
  }

  > button svg,
  > * > button svg {
    width: 21px !important;
    height: 21px !important;
    fill: currentColor;
    color: currentColor;
    opacity: 1 !important;
  }

  > button:hover,
  > * > button:hover {
    color: var(--color-primary);
    background: rgba(255, 255, 255, .58);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, .62),
      0 14px 28px rgba(76, 103, 124, .16);
    transform: translateY(-1px);
  }

  > button:active,
  > * > button:active {
    transform: translateY(0) scale(.96);
  }

  .footerLeftControlBtn.active {
    color: #fff;
    background: var(--color-primary);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, .28),
      0 14px 30px var(--color-primary-alpha-700);
  }
}

</style>
