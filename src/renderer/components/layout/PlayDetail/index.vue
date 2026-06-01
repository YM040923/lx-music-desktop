<template lang="pug">
transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave")
  div(v-if="isShowPlayerDetail" :class="[$style.page, { fullscreen: isFullscreen }]" @contextmenu="handleContextMenu")
    // Dynamic blurred album art background
    div(:class="$style.backdrop")
      img(v-if="musicInfo.pic" :class="$style.bgImg" :src="musicInfo.pic")
      div(:class="$style.bgOverlay")
    // Top bar
    div(:class="$style.top")
      ControlBtnsLeftHeader(v-if="appSetting['common.controlBtnPosition'] == 'left'")
      ControlBtnsRightHeader(v-else)
    // Main: two columns
    div(:class="[$style.main, {[$style.showComment]: isShowPlayComment}]")
      // Left: album art + info
      div(:class="$style.left")
        div(:class="$style.albumWrap")
          img(v-if="musicInfo.pic" :class="$style.albumArt" :src="musicInfo.pic")
          div(v-else :class="$style.albumPlaceholder")
            svg(viewBox="0 0 24 24" width="48" height="48")
              use(xlink:href="#icon-music")
        div(:class="$style.meta")
          h1(:class="$style.title") {{ musicInfo.name || 'YM Music' }}
          p(:class="$style.artist") {{ musicInfo.singer || ' ' }}
      // Right: lyrics
      transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
        LyricPlayer(v-if="visibled")
      // Comment panel
      MusicComment(v-if="visibled" :class="$style.comment" :show="isShowPlayComment" :music-info="playMusicInfo.musicInfo" @close="hideComment")
    // Bottom: playbar
    transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
      PlayBar(v-if="visibled")
    // Visualizer
    transition(enter-active-class="animated-slow fadeIn" leave-active-class="animated-slow fadeOut")
      common-audio-visualizer(v-if="appSetting['player.audioVisualization'] && visibled")
</template>

<script>
import { ref, watch } from '@common/utils/vueTools'
import { isFullscreen } from '@renderer/store'
import {
  isShowPlayerDetail,
  isShowPlayComment,
  musicInfo,
  playMusicInfo,
} from '@renderer/store/player/state'
import {
  setShowPlayerDetail,
  setShowPlayComment,
  setShowPlayLrcSelectContentLrc,
} from '@renderer/store/player/action'
import LyricPlayer from './LyricPlayer.vue'
import PlayBar from './PlayBar.vue'
import MusicComment from './components/MusicComment/index.vue'
import ControlBtnsLeftHeader from './ControlBtnsLeftHeader.vue'
import ControlBtnsRightHeader from './ControlBtnsRightHeader.vue'
import { registerAutoHideMounse, unregisterAutoHideMounse } from './autoHideMounse'
import { appSetting } from '@renderer/store/setting'
import { closeWindow, maxWindow, minWindow, setFullScreen } from '@renderer/utils/ipc'

export default {
  name: 'CorePlayDetail',
  components: {
    ControlBtnsLeftHeader,
    ControlBtnsRightHeader,
    LyricPlayer,
    PlayBar,
    MusicComment,
  },
  setup() {
    const visibled = ref(false)
    let clickTime = 0

    const hide = () => { setShowPlayerDetail(false) }
    const handleContextMenu = () => {
      if (window.performance.now() - clickTime > 400) {
        clickTime = window.performance.now()
        return
      }
      clickTime = 0
      hide()
    }
    const hideComment = () => { setShowPlayComment(false) }
    const handleAfterEnter = () => {
      if (isFullscreen.value) registerAutoHideMounse()
      visibled.value = true
    }
    const handleAfterLeave = () => {
      setShowPlayLrcSelectContentLrc(false)
      hideComment(false)
      visibled.value = false
      unregisterAutoHideMounse()
    }
    watch(isFullscreen, isFullscreen => {
      (isFullscreen ? registerAutoHideMounse : unregisterAutoHideMounse)()
    })

    return {
      appSetting,
      playMusicInfo,
      isShowPlayerDetail,
      isShowPlayComment,
      musicInfo,
      hide,
      handleContextMenu,
      hideComment,
      handleAfterEnter,
      handleAfterLeave,
      visibled,
      isFullscreen,
      fullscreenExit() {
        void setFullScreen(false).then(f => { isFullscreen.value = f })
      },
      min() { minWindow() },
      max() { maxWindow() },
      close() { closeWindow() },
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.page {
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  border-radius: @radius-border;
  -webkit-app-region: no-drag;
  box-sizing: border-box;
  background: #eef7fa;
  color: rgba(31, 43, 54, .88);

  * { box-sizing: border-box; }
}

// Dynamic blurred album art background
.backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background:
    linear-gradient(135deg, #edf7fa 0%, #dfeff1 42%, #fbfdfe 100%);
}

.bgImg {
  position: absolute;
  inset: -18%;
  width: 136%;
  height: 136%;
  object-fit: cover;
  filter: blur(76px) brightness(1.14) saturate(1.32);
  opacity: .72;
  transform: scale(1.06);
  animation: bgPulse 26s ease-in-out infinite alternate;
}

@keyframes bgPulse {
  0% { transform: scale(1.06); }
  100% { transform: scale(1.1); }
}

.bgOverlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, .62), rgba(245, 251, 252, .34) 48%, rgba(255, 255, 255, .60)),
    linear-gradient(0deg, rgba(255, 255, 255, .46), rgba(255, 255, 255, .10) 46%, rgba(255, 255, 255, .30));
}

// Top bar
.top {
  position: relative;
  z-index: 5;
  flex: 0 0 62px;
}

// Main layout
.main {
  position: relative;
  flex: auto;
  min-height: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  padding: 0 clamp(38px, 5vw, 76px) 14px;
  z-index: 1;
  gap: clamp(34px, 5vw, 72px);

  :global {
    .right {
      min-width: 0;
      padding: 8px 0 24px;
    }
  }

  &.showComment {
    gap: 24px;

    .left { flex: 0 0 23%; }

    :global {
      .right {
        flex: 0 1 31%;
        min-width: 0;
        padding-right: 0;
      }

      .lyricSelectContent {
        font-size: 14px;
      }
    }

    .comment {
      opacity: 1;
      transform: scaleX(1);
      pointer-events: auto;
    }
  }
}

// Left column: album art + info
.left {
  flex: 0 0 34%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 10px 0 34px;
  overflow: hidden;
  transition: flex 0.3s ease;
}

.albumWrap {
  position: relative;
  width: 66%;
  max-width: 310px;
  min-width: 180px;
  aspect-ratio: 1 / 1;

  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, .62);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .28);
    pointer-events: none;
  }
}

.albumArt {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 21px;
  box-shadow:
    0 24px 56px rgba(76, 103, 124, .24),
    0 8px 20px rgba(76, 103, 124, .12);
}

.albumPlaceholder {
  width: 100%;
  height: 100%;
  border-radius: 21px;
  background: rgba(255,255,255,0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(54, 76, 92, .28);
}

.meta {
  width: 100%;
  max-width: 320px;
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: rgba(29, 41, 53, .9);
  line-height: 1.3;
  margin: 0 0 6px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  .mixin-ellipsis-1();
}

.artist {
  font-size: 14px;
  color: rgba(54, 70, 84, .58);
  margin: 0;
  font-family: 'Segoe UI', system-ui, sans-serif;
  .mixin-ellipsis-1();
}

// Comment panel
.comment {
  flex: 0 0 0;
  width: 0;
  height: 100%;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: right center;
  pointer-events: none;
  overflow: hidden;
  transition: transform 0.3s ease, opacity 0.2s ease, width 0.3s ease;
}

.showComment {
  .comment {
    flex-basis: 50%;
    width: 50%;
  }
}
</style>
