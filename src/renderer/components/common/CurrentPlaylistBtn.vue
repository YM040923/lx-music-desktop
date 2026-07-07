<template>
  <div ref="btnRef" :class="$style.btnContent">
    <button ref="buttonRef" :class="[props.buttonClass || $style.btn, { [$style.active]: visible }]" :aria-label="$t('player__current_playlist')" @click.stop="toggleVisible">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 24 24" space="preserve">
        <use xlink:href="#icon-current-playlist" />
      </svg>
    </button>
    <teleport to="#root">
      <div
        v-if="visible"
        :class="$style.drawer"
        @click.stop
      >
        <div class="scroll" :class="$style.panel">
        <div :class="$style.header">
          <h3>{{ $t('player__current_playlist') }}</h3>
          <span>{{ currentList.length + tempPlayList.length }}</span>
        </div>

        <section v-if="tempPlayList.length" :class="$style.section">
          <div :class="$style.sectionTitle">{{ $t('player__queue_play_later') }}</div>
          <button
            v-for="(item, index) in tempPlayList"
            :key="`temp-${item.musicInfo.id}-${index}`"
            type="button"
            :class="[$style.song, { [$style.active]: isCurrentMusic(item.musicInfo) }]"
            @click="handlePlayTemp(index)"
          >
            <span :class="$style.index">{{ index + 1 }}</span>
            <span :class="$style.info">
              <span :class="$style.name">{{ getMusicName(item.musicInfo) }}</span>
              <span :class="$style.singer">{{ getMusicSinger(item.musicInfo) }}</span>
            </span>
          </button>
        </section>

        <section :class="$style.section">
          <div :class="$style.sectionTitle">{{ currentListName }}</div>
          <div v-if="!currentList.length" :class="$style.empty">{{ $t('player__current_playlist_empty') }}</div>
          <button
            v-for="(item, index) in currentList"
            :key="`${item.id}-${index}`"
            type="button"
            :class="[$style.song, { [$style.active]: isCurrentMusic(item) }]"
            @click="handlePlayCurrent(index)"
          >
            <span :class="$style.index">{{ index + 1 }}</span>
            <span :class="$style.info">
              <span :class="$style.name">{{ getMusicName(item) }}</span>
              <span :class="$style.singer">{{ getMusicSinger(item) }}</span>
            </span>
          </button>
        </section>
      </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from '@common/utils/vueTools'
import { useI18n } from '@renderer/plugins/i18n'
import { LIST_IDS } from '@common/constants'
import { playList, playNext } from '@renderer/core/player'
import { getList, removeTempPlayList } from '@renderer/store/player/action'
import { playInfo, playMusicInfo, tempPlayList } from '@renderer/store/player/state'
import { defaultList, loveList, tempList, userLists } from '@renderer/store/list/state'

const props = defineProps<{
  buttonClass?: string
}>()

const emit = defineEmits<(event: 'show') => void>()

const t = useI18n()
const btnRef = ref<HTMLElement | null>(null)
const visible = ref(false)

const currentListId = computed(() => playInfo.playerListId ?? playMusicInfo.listId)
const currentList = computed(() => getList(currentListId.value))
const currentMusicId = computed(() => playMusicInfo.musicInfo?.id ?? null)

const currentListName = computed(() => {
  const id = currentListId.value
  if (!id) return t('player__queue_current_list')
  if (id == LIST_IDS.DEFAULT) return t(defaultList.name)
  if (id == LIST_IDS.LOVE) return t(loveList.name)
  if (id == LIST_IDS.TEMP) return tempList.name
  if (id == LIST_IDS.DOWNLOAD) return t('download')
  return userLists.find(list => list.id == id)?.name ?? t('player__queue_current_list')
})

const getMusicBaseInfo = (musicInfo: LX.Player.PlayMusicInfo['musicInfo']) => {
  return 'progress' in musicInfo ? musicInfo.metadata.musicInfo : musicInfo
}

const getMusicName = (musicInfo: LX.Player.PlayMusicInfo['musicInfo']) => {
  return getMusicBaseInfo(musicInfo).name
}

const getMusicSinger = (musicInfo: LX.Player.PlayMusicInfo['musicInfo']) => {
  return getMusicBaseInfo(musicInfo).singer || t('player__queue_unknown_artist')
}

const isCurrentMusic = (musicInfo: LX.Player.PlayMusicInfo['musicInfo']) => {
  return musicInfo.id == currentMusicId.value
}

const show = () => {
  visible.value = true
  emit('show')
}

const hide = () => {
  visible.value = false
}

const toggleVisible = () => {
  if (visible.value) hide()
  else show()
}

const handlePlayCurrent = (index: number) => {
  const id = currentListId.value
  if (!id) return
  hide()
  playList(id, index)
}

const handlePlayTemp = (index: number) => {
  const target = tempPlayList[index]
  if (!target) return
  hide()
  if (index > 0) {
    removeTempPlayList(index)
    tempPlayList.unshift(target)
  }
  void playNext()
}

const handleDocumentClick = () => {
  hide()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';
@import '@renderer/assets/styles/index.less';

.btnContent {
  display: contents;
}

.btn {
  position: relative;
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
  }

  &:hover svg {
    opacity: .9;
  }

  &:active svg {
    opacity: 1;
  }
}

.active {
  color: #fff !important;
  background: var(--color-primary-alpha-500) !important;
}

.drawer {
  position: fixed;
  right: 18px;
  top: 88px;
  bottom: 106px;
  width: min(380px, calc(100vw - 48px));
  z-index: 20;
  border-radius: 16px;
  background: rgba(255, 255, 255, .74);
  backdrop-filter: blur(30px) saturate(1.12);
  -webkit-backdrop-filter: blur(30px) saturate(1.12);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .56),
    0 18px 48px rgba(76, 103, 124, .18);
  overflow: hidden;
  box-sizing: border-box;
  animation: drawerIn @transition-normal;
}

.panel {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  gap: 12px;
  color: var(--color-font);
  padding: 14px;
  box-sizing: border-box;
  overflow: auto;
}

@keyframes drawerIn {
  from {
    opacity: 0;
    transform: translateX(16px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 2px 4px 0;

  h3 {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }

  span {
    flex: none;
    min-width: 28px;
    height: 20px;
    padding: 0 7px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-size: 12px;
    color: var(--color-font-label);
    background: var(--color-primary-light-300-alpha-400);
  }
}

.section {
  min-height: 0;
  display: flex;
  flex-flow: column nowrap;
  gap: 4px;
}

.sectionTitle {
  padding: 0 4px;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-font-label);
  .mixin-ellipsis-1();
}

.song {
  width: 100%;
  min-height: 42px;
  border: none;
  border-radius: 8px;
  padding: 5px 8px;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  color: var(--color-font);
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color @transition-fast, color @transition-fast;

  &:hover {
    background: var(--color-primary-light-600-alpha-400);
  }

  &.active {
    color: var(--color-primary);
    background: var(--color-primary-light-300-alpha-400);
  }
}

.index {
  justify-self: center;
  font-size: 12px;
  color: var(--color-font-label);
  font-variant-numeric: tabular-nums;
}

.info {
  min-width: 0;
  display: flex;
  flex-flow: column nowrap;
  gap: 2px;
}

.name,
.singer {
  display: block;
  .mixin-ellipsis-1();
}

.name {
  font-size: 13px;
  line-height: 18px;
}

.singer {
  font-size: 12px;
  line-height: 16px;
  color: var(--color-font-label);
}

.empty {
  min-height: 72px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-font-label);
  background: var(--color-primary-light-300-alpha-200);
  font-size: 13px;
}
</style>
