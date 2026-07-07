<template>
  <div :class="$style.wrapper">
    <div :class="$style.island">
      <!-- 左侧: 封面 + 歌曲信息 -->
      <div :class="$style.left">
        <div :class="$style.cover" :aria-label="$t('player__pic_tip')" @click="showPlayerDetail" @contextmenu="handleToMusicLocation">
          <img v-if="musicInfo.pic" :src="musicInfo.pic" decoding="async" @error="imgError" />
          <div v-else :class="$style.coverPlaceholder">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" space="preserve" width="28" height="28"><use xlink:href="#icon-music" /></svg>
          </div>
        </div>
        <div :class="$style.info">
          <div :class="$style.title" :aria-label="title + $t('copy_tip')" @click="handleCopy(title)">{{ title || 'YM Music' }}</div>
          <div :class="$style.artist">{{ musicInfo.singer || statusText }}</div>
        </div>
      </div>

      <!-- 中间: 播放控制 + 进度条 -->
      <div :class="$style.center">
        <div :class="$style.controls">
          <button :class="$style.ctrlBtn" :aria-label="$t('player__prev')" @click="playPrev()">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" space="preserve"><use xlink:href="#icon-prevMusic" /></svg>
          </button>
          <button :class="[$style.playBtn, isPlay ? $style.playing : $style.paused]" :aria-label="isPlay ? $t('player__pause') : $t('player__play')" @click="togglePlay">
            <svg v-if="isPlay" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" space="preserve"><use xlink:href="#icon-pause" /></svg>
            <svg v-else version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" space="preserve"><use xlink:href="#icon-play" /></svg>
          </button>
          <button :class="$style.ctrlBtn" :aria-label="$t('player__next')" @click="playNext()">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" space="preserve"><use xlink:href="#icon-nextMusic" /></svg>
          </button>
        </div>
        <div :class="$style.progressRow">
          <span :class="$style.time">{{ nowPlayTimeStr }}</span>
          <div ref="progressTrack" :class="$style.progressTrack" @mousedown="startSeek">
            <div :class="$style.progressFill" :style="{ width: progress * 100 + '%' }"></div>
            <div :class="$style.progressThumb" :style="{ left: progress * 100 + '%' }"></div>
          </div>
          <span :class="$style.time">{{ maxPlayTimeStr }}</span>
        </div>
      </div>

      <!-- 右侧: 辅助按钮 -->
      <div :class="$style.right">
        <button :class="$style.iconBtn" :aria-label="$t('player__add_music_to')" @click="addMusicTo">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" space="preserve"><use xlink:href="#icon-add-2" /></svg>
        </button>
        <common-start-play-timer-btn :button-class="$style.iconBtn" />
        <common-current-playlist-btn :button-class="$style.iconBtn" />
        <button :class="$style.iconBtn" :aria-label="toggleDesktopLyricBtnTitle" @click="toggleDesktopLyric" @contextmenu="toggleLockDesktopLyric">
          <svg v-show="appSetting['desktopLyric.enable']" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" space="preserve"><use xlink:href="#icon-desktop-lyric-on" /></svg>
          <svg v-show="!appSetting['desktopLyric.enable']" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" space="preserve"><use xlink:href="#icon-desktop-lyric-off" /></svg>
        </button>
        <common-volume-btn :button-class="$style.iconBtn" />
        <common-toggle-play-mode-btn :button-class="$style.iconBtn" />
      </div>
    </div>
    <common-list-add-modal v-model:show="isShowAddMusicTo" :music-info="playMusicInfo.musicInfo" />
  </div>
</template>

<script>
import { ref, computed } from '@common/utils/vueTools'
import { useRouter } from '@common/utils/vueRouter'
import { clipboardWriteText } from '@common/utils/electron'
import usePlayProgress from '@renderer/utils/compositions/usePlayProgress'
import useToggleDesktopLyric from '@renderer/utils/compositions/useToggleDesktopLyric'
import {
  statusText,
  musicInfo,
  isShowPlayerDetail,
  isPlay,
  playInfo,
  playMusicInfo,
} from '@renderer/store/player/state'
import {
  setMusicInfo,
  setShowPlayerDetail,
} from '@renderer/store/player/action'
import { appSetting } from '@renderer/store/setting'
import { togglePlay, playNext, playPrev } from '@renderer/core/player'
import { LIST_IDS } from '@common/constants'
import { formatMusicName } from '@renderer/utils'

export default {
  name: 'ModernPlayBar',
  setup() {
    const router = useRouter()
    const progressTrack = ref(null)

    const {
      nowPlayTimeStr,
      maxPlayTimeStr,
      progress,
      isActiveTransition,
      handleTransitionEnd,
    } = usePlayProgress()

    const {
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
    } = useToggleDesktopLyric()

    const isShowAddMusicTo = ref(false)

    const showPlayerDetail = () => {
      if (!playMusicInfo.musicInfo) return
      setShowPlayerDetail(true)
    }

    const handleCopy = (text) => {
      clipboardWriteText(text)
    }

    const imgError = () => {
      setMusicInfo({ pic: null })
    }

    const handleToMusicLocation = () => {
      const listId = playMusicInfo.listId
      if (!listId || listId == LIST_IDS.DOWNLOAD || !playMusicInfo.musicInfo) return
      if (playInfo.playIndex == -1) return
      void router.push({
        path: '/list',
        query: { id: listId, scrollIndex: playInfo.playIndex },
      })
    }

    const addMusicTo = () => {
      if (!musicInfo.id) return
      isShowAddMusicTo.value = true
    }

    const title = computed(() => {
      return musicInfo.name
        ? formatMusicName(appSetting['download.fileName'], musicInfo.name, musicInfo.singer)
        : ''
    })

    const startSeek = (e) => {
      const track = progressTrack.value
      if (!track) return
      const rect = track.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      window.app_event.emit('setProgress', ratio)
    }

    return {
      musicInfo,
      nowPlayTimeStr,
      maxPlayTimeStr,
      progress,
      isActiveTransition,
      handleTransitionEnd,
      handleCopy,
      imgError,
      statusText,
      title,
      showPlayerDetail,
      isPlay,
      togglePlay,
      playNext,
      playPrev,
      handleToMusicLocation,
      isShowPlayerDetail,
      isShowAddMusicTo,
      addMusicTo,
      toggleDesktopLyricBtnTitle,
      toggleDesktopLyric,
      toggleLockDesktopLyric,
      appSetting,
      playMusicInfo,
      progressTrack,
      startSeek,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
@import '@renderer/assets/styles/index.less';

.wrapper {
  position: relative;
  padding: 0 16px 10px 16px;
  z-index: 2;
}

.island {
  height: @height-player;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 16px;
  background: rgba(255, 255, 255, .58);
  backdrop-filter: blur(26px) saturate(1.12);
  -webkit-backdrop-filter: blur(26px) saturate(1.12);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .54),
    0 14px 34px rgba(76, 103, 124, .12);
  padding: 0 12px;
  gap: 12px;
  box-sizing: border-box;
  position: relative;
  z-index: 0;

  * {
    box-sizing: border-box;
  }
}

// 左侧: 封面 + 信息
.left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.cover {
  flex: none;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 8px 18px rgba(76, 103, 124, .16);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.coverPlaceholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light-600-alpha-400);
  color: rgba(43, 58, 71, .32);
  border-radius: 12px;
}

.info {
  flex: auto;
  min-width: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  gap: 4px;
}

.title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-font);
  .mixin-ellipsis-1();
  cursor: pointer;
  line-height: 1.3;

  &:hover {
    opacity: 0.7;
  }
}

.artist {
  font-size: 12px;
  color: var(--color-font-label);
  .mixin-ellipsis-1();
}

// 中间: 控制 + 进度条 — 绝对居中
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  gap: 6px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ctrlBtn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-button-font);
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;

  &:hover {
    opacity: 0.8;
    background: var(--color-primary-light-600-alpha-400);
  }
  &:active {
    opacity: 0.6;
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
}

.playBtn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 12px var(--color-primary-alpha-500);

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 20px var(--color-primary-alpha-400);
  }

  &:active {
    transform: scale(0.96);
  }
}

.paused svg {
  transform: translateX(1px);
}

.playing svg {
  transform: translateX(0);
}

.progressRow {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 360px;
}

.time {
  flex: none;
  font-size: 11px;
  color: var(--color-font-label);
  font-variant-numeric: tabular-nums;
  min-width: 36px;
  text-align: center;
}

.progressTrack {
  flex: auto;
  height: 4px;
  background: var(--color-primary-light-300-alpha-400);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  transition: height 0.15s ease;

  &:hover {
    height: 6px;
    border-radius: 3px;

    .progressThumb {
      transform: translate(-50%, -50%) scale(1);
    }
  }
}

.progressFill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--color-primary);
  border-radius: inherit;
  transition: width 0.1s linear;
}

.progressThumb {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.15s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

// 右侧: 辅助按钮
.right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 4px;
  gap: 2px;
}

.iconBtn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--color-button-font);
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.15s ease;

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  &:hover {
    background: var(--color-primary-light-600-alpha-400);
    transform: scale(1.06);
  }
  &:active {
    transform: scale(0.94);
  }
}

</style>
