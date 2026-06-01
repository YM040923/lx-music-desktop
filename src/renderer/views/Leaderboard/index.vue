<template>
  <div :class="$style.leaderboard">
    <div :class="$style.lists">
      <div :class="$style.listsSelect">
        <base-selection :model-value="source" :class="$style.select" :list="sourceList" item-key="id" item-name="name" @update:model-value="handleToggleSource" />
      </div>
      <BoardList ref="boardListRef" :board-id="boardId" :source="source" @show-menu="$refs.musicListRef?.hideMenu()" />
    </div>
    <div :class="$style.list">
      <MusicList ref="musicListRef" :source="source" :board-id="boardId" @show-menu="$refs.boardListRef?.hideMenu()" />
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@common/utils/vueTools'
import { getLeaderboardSetting, setLeaderboardSetting } from '@renderer/utils/data'
import BoardList from './BoardList/index.vue'
import MusicList from './MusicList/index.vue'
import { sources } from '@renderer/store/leaderboard/state'
import { sourceNames } from '@renderer/store'
import { useRoute, useRouter } from '@common/utils/vueRouter'


const source = ref('')
const boardId = ref(null)

const verifyQueryParams = async function(to, from, next) {
  let _source = to.query.source
  let _boardId = to.query.boardId

  if (_source == null) {
    const setting = await getLeaderboardSetting()
    if (_source == null) {
      _source = setting.source
      _boardId = setting.boardId
    }
    next({
      path: to.path,
      query: { ...to.query, source: _source, boardId: _boardId },
    })
    return
  }
  next()
  source.value = _source
  boardId.value = _boardId
  void setLeaderboardSetting({ source: _source, boardId: _boardId })
}


export default {
  components: {
    BoardList,
    MusicList,
  },
  beforeRouteEnter: verifyQueryParams,
  beforeRouteUpdate: verifyQueryParams,
  setup() {
    const musicListRef = ref(null)
    const boardListRef = ref(null)
    const sourceList = computed(() => {
      return sources.map(s => ({ id: s, name: sourceNames.value[s] }))
    })
    const router = useRouter()
    const route = useRoute()
    const handleToggleSource = (id) => {
      void router.replace({
        path: route.path,
        query: {
          source: id,
        },
      })
    }

    return {
      source,
      boardId,
      sourceList,
      handleToggleSource,
      musicListRef,
      boardListRef,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.leaderboard {
  height: 100%;
  display: flex;
  position: relative;
  padding: 20px 28px 24px;
  gap: 20px;
  box-sizing: border-box;
}

.lists {
  flex: none;
  width: 16%;
  min-width: 180px;
  display: flex;
  flex-flow: column nowrap;
  border-radius: @radius-border;
  background: var(--color-main-background);
  box-shadow: 0 2px 16px rgba(0, 0, 0, .06);
  overflow: hidden;
}

.listsSelect {
  font-size: 13px;
  padding: 12px;
  box-sizing: border-box;

  >:global(.content) {
    display: block;
    width: 100%;
  }
  :global(.label-content) {
    height: 38px;
    padding: 0 12px 0 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, .46) !important;
    color: var(--color-font);
    font-size: 13px;
    font-weight: 600;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, .58),
      0 8px 18px rgba(76, 103, 124, .08);
    transition: @transition-fast;
    transition-property: color, background-color, box-shadow, transform;
    &:hover {
      color: var(--color-primary);
      background: rgba(255, 255, 255, .68) !important;
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, .72),
        0 10px 22px rgba(76, 103, 124, .12);
    }
    &:active {
      transform: scale(.98);
    }
  }
  :global(.label) {
    color: inherit !important;
  }
  :global(.icon) {
    width: 18px;
    height: 18px;
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--color-primary-light-800-alpha-500);
    color: var(--color-primary);
  }
  :global(.icon svg) {
    width: 9px;
  }

}

.list {
  position: relative;
  overflow: hidden;
  height: 100%;
  flex: auto;
  display: flex;
  flex-flow: column nowrap;
  border-radius: @radius-border;
  background: var(--color-main-background);
  box-shadow: 0 2px 16px rgba(0, 0, 0, .06);
}

</style>
