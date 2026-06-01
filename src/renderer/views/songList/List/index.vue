<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <div :class="$style.left">
        <tag-list :source="source" :tag-id="tagId" :sort-id="sortId" />
        <sort-tab :source="source" :tag-id="tagId" :sort-id="sortId" />
      </div>
      <base-btn :class="$style.btn" outline min @click="visibleOpenSongListModal = true">{{ $t('songlist__import_input_show_btn') }}</base-btn>
      <base-selection :model-value="source" :class="$style.select" :list="sourceList" item-key="id" item-name="name" @update:model-value="handleToggleSource" />
    </div>
    <list-view :source="source" :tag-id="tagId" :sort-id="sortId" :page="page" />
    <open-list-modal v-model="visibleOpenSongListModal" :source-list="sourceList" />
  </div>
</template>

<script lang="ts">
import { computed, ref } from '@common/utils/vueTools'
import { getSongListSetting, setSongListSetting } from '@renderer/utils/data'
import TagList from './components/TagList.vue'
import SortTab from './components/SortTab.vue'
import OpenListModal from './components/OpenListModal.vue'
import ListView from './ListView.vue'
import { sources, listInfo, isVisibleListDetail } from '@renderer/store/songList/state'
import { sourceNames } from '@renderer/store'
import { useRoute, useRouter } from '@common/utils/vueRouter'

const source = ref<LX.OnlineSource>('kw')
const tagId = ref<string>('')
const sortId = ref<string>('')
const page = ref<number>(1)


interface Query {
  source?: string
  tagId?: string
  sortId?: string
  page?: string
}

const verifyQueryParams = async function(this: any, to: { query: Query, path: string }, from: any, next: (route?: { path: string, query: Query }) => void) {
  let _source = to.query.source
  let _tagId = to.query.tagId
  let _sortId = to.query.sortId
  let _page: string | undefined = to.query.page

  if (isVisibleListDetail.value) {
    next({ path: '/songList/detail', query: {} })
    return
  } else if (_source == null) {
    if (listInfo.key) {
      _source = listInfo.source
      _tagId = listInfo.tagId
      _sortId = listInfo.sortId
      _page = listInfo.page.toString()
    } else {
      const setting = await getSongListSetting()
      _source = setting.source
      _tagId = setting.tagId
      _sortId = setting.sortId
      _page = '1'
    }

    next({
      path: to.path,
      query: { ...to.query, source: _source, tagId: _tagId, sortId: _sortId, page: _page },
    })
    return
  }
  next()
  source.value = _source as LX.OnlineSource
  tagId.value = _tagId ?? ''
  sortId.value = _sortId ?? ''
  page.value = _page ? parseInt(_page) : 1
  void setSongListSetting({ source: _source, tagId: _tagId, sortId: _sortId })
}


export default {
  components: {
    TagList,
    SortTab,
    ListView,
    OpenListModal,
  },
  beforeRouteEnter: verifyQueryParams,
  beforeRouteUpdate: verifyQueryParams,
  setup() {
    const visibleOpenSongListModal = ref(false)

    const sourceList = computed(() => {
      return sources.map(s => ({ id: s, name: sourceNames.value[s] }))
    })
    const router = useRouter()
    const route = useRoute()
    const handleToggleSource = (id: LX.OnlineSource) => {
      if (id == source.value) return
      void router.replace({
        path: route.path,
        query: {
          source: id,
          tagId: '',
        },
      })
    }

    return {
      source,
      tagId,
      sortId,
      page,
      sourceList,
      handleToggleSource,
      visibleOpenSongListModal,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.container {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  padding: 20px 28px 24px;
  gap: 16px;
  box-sizing: border-box;
}
.header {
  flex: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-radius: @radius-border;
  background: var(--color-main-background);
  box-shadow: 0 2px 16px rgba(0, 0, 0, .06);
}
.left {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 8px;
}

.btn {
  flex: none;
  font-size: 13px;
  color: var(--color-font);
  transition: color @transition-fast;
  background: none !important;
  &:hover {
    color: var(--color-primary-font-hover);
  }
}

.select {
  flex: none;
  font-size: 13px;
  --selection-width: 168px;

  :global {
    .label-content {
      height: 38px;
      padding: 0 14px 0 16px;
      background: rgba(255, 255, 255, .46) !important;
      color: var(--color-font);
      border-radius: 999px;
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
    .label {
      color: inherit !important;
    }
    .icon {
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
    .icon svg {
      width: 9px;
    }
  }
}

</style>
