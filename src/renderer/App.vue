<template>
  <div id="container" class="view-container">
    <div class="app-ambient-bg" aria-hidden="true">
      <img v-if="musicInfo.pic" class="app-ambient-cover" :src="musicInfo.pic">
      <div class="app-ambient-wash"></div>
    </div>
    <layout-aside id="left" />
    <div id="right">
      <layout-toolbar id="toolbar" />
      <layout-view id="view" />
      <layout-play-bar id="player" />
    </div>
    <layout-icons />
    <layout-change-log-modal />
    <layout-update-modal />
    <layout-pact-modal />
    <layout-sync-mode-modal />
    <layout-sync-auth-code-modal />
    <layout-play-detail />
  </div>
</template>

<script setup>
import { onMounted } from '@common/utils/vueTools'
// import BubbleCursor from '@common/utils/effects/cursor-effects/bubbleCursor'
// import '@common/utils/effects/snow.min'
import useApp from '@renderer/core/useApp'
import { musicInfo } from '@renderer/store/player/state'

useApp()

onMounted(() => {
  document.getElementById('root').style.display = 'block'

  // const styles = getComputedStyle(document.documentElement)
  // window.lxData.bubbleCursor = new BubbleCursor({
  //   fillStyle: styles.getPropertyValue('--color-primary-alpha-900'),
  //   strokeStyle: styles.getPropertyValue('--color-primary-alpha-700'),
  // })
})

// onBeforeUnmount(() => {
//   window.lxData.bubbleCursor?.destroy()
// })

</script>


<style lang="less">
@import './assets/styles/index.less';
@import './assets/styles/layout.less';

html {
  height: 100vh;
}
html, body {
  // overflow: hidden;
  box-sizing: border-box;
}

body {
  user-select: none;
  height: 100%;
}
#root {
  height: 100%;
  position: relative;
  overflow: hidden;
  color: var(--color-font);
  --color-app-background: rgba(227, 240, 244, .72);
  --color-main-background: rgba(255, 255, 255, .58);
  --color-content-background: rgba(248, 252, 253, .84);
  background:
    linear-gradient(135deg, #edf6fa 0%, #deedf1 44%, #f8fbfc 100%);
  transition: background-color @transition-normal;
  box-sizing: border-box;
}

.disableAnimation * {
  transition: none !important;
  animation: none !important;
}

body {
  padding: @shadow-app;
}
.transparent {
  background: transparent;
  #body {
    border-radius: @radius-border;
  }
  #root {
    box-shadow: 0 0 @shadow-app rgba(0, 0, 0, 0.5);
    border-radius: @radius-border;
  }
  #container {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  #right {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}
.disableTransparent {
  background-color: var(--color-content-background);

  #body {
    border: none;
    box-shadow: 0 0 0 1px var(--color-primary-light-500);
  }

  #right {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
.fullscreen {
  background-color: var(--color-content-background);

  body {
    padding: 0 !important;
  }

  #body {
    border-radius: 0 !important;
  }

  #root {
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  #container {
    border-radius: 0 !important;
  }

  #right {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

#container {
  position: relative;
  display: flex;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}

.app-ambient-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 14% 6%, rgba(120, 188, 206, .28), transparent 34%),
    linear-gradient(135deg, #eef7fb 0%, #deedf1 48%, #f8fbfc 100%);
  pointer-events: none;
}

.app-ambient-cover {
  position: absolute;
  inset: -18%;
  width: 136%;
  height: 136%;
  object-fit: cover;
  filter: blur(72px) saturate(1.28) brightness(1.12);
  opacity: .62;
  transform: scale(1.06);
}

.app-ambient-wash {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, .34), rgba(244, 250, 252, .62) 58%, rgba(255, 255, 255, .40)),
    linear-gradient(0deg, rgba(255, 255, 255, .24), rgba(255, 255, 255, .08));
}

#left {
  flex: none;
  width: @width-app-left;
  position: relative;
  z-index: 1;
}
#right {
  flex: auto;
  display: flex;
  flex-flow: column nowrap;
  transition: background-color @transition-normal;
  background-color: var(--color-main-background);
  backdrop-filter: blur(30px) saturate(1.15);
  -webkit-backdrop-filter: blur(30px) saturate(1.15);

  border-top-left-radius: @radius-border;
  border-bottom-left-radius: @radius-border;
  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, .42),
    0 18px 46px rgba(80, 104, 118, 0.12);
  position: relative;
  z-index: 1;
}
#toolbar, #player {
  flex: none;
  z-index: 0;
}
#view {
  position: relative;
  z-index: 1;
  flex: auto;
  min-height: 0;
  overflow: hidden;
}

.view-container {
  transition: opacity @transition-normal;
}
#root.show-modal > .view-container {
  opacity: .9;
}
#view.show-modal > .view-container {
  opacity: .2;
}

</style>

