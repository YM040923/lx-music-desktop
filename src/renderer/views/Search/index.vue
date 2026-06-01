<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <base-tab v-model="source" :class="$style.sourceTabs" :list="sources" @change="handleSourceChange" />
      <base-tab v-model="searchType" :class="$style.typeTabs" :list="searchTypes" @change="handleTypeChange" />
    </div>
    <div :class="$style.main">
      <song-list-list v-if="searchType == 'songlist'" v-show="searchText" :page="page" :source-id="source" />
      <music-list v-else v-show="searchText" :page="page" :source-id="source" />
      <blank-view :visible="!searchText" :source="source" />
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from '@common/utils/vueRouter'
import { searchText } from '@renderer/store/search/state'
import { getSearchSetting, setSearchSetting } from '@renderer/utils/data'
import { sources as _sources } from '@renderer/store/search/music'

import MusicList from './MusicList/index.vue'
import SongListList from './SongListList/index.vue'
import BlankView from './components/BlankView.vue'
import { computed, ref } from '@common/utils/vueTools'
import { sourceNames } from '@renderer/store'

const source = ref('kw')
const searchType = ref('music')
const page = ref(1)

const verifyQueryParams = async(to, from, next) => {
  let _source = to.query.source
  let _type = to.query.type
  let _page = to.query.page

  if (_source == null || _type == null) {
    const setting = await getSearchSetting()
    _source ??= setting.source
    _type ??= setting.type

    next({
      path: to.path,
      query: { ...to.query, source: _source, type: _type, page: _page },
    })
    return
  }
  source.value = _source
  searchType.value = _type

  if (_page) page.value = parseInt(_page)

  if (to.query.text != null) {
    searchText.value = to.query.text
    if (!_page) page.value = 1
  } else {
    searchText.value = ''
  }
  next()
  void setSearchSetting({ source: _source, type: _type })
}

export default {
  components: {
    MusicList,
    SongListList,
    BlankView,
  },
  beforeRouteEnter: verifyQueryParams,
  beforeRouteUpdate: verifyQueryParams,
  setup() {
    const route = useRoute()
    const router = useRouter()

    const sources = _sources.map(id => {
      return {
        id,
        label: sourceNames.value[id],
      }
    })
    const handleSourceChange = (id) => {
      void router.replace({
        path: route.path,
        query: {
          ...route.query,
          source: id,
          page: 1,
        },
      })
    }

    const searchTypes = computed(() => {
      return [
        { label: window.i18n.t('search__type_music'), id: 'music' },
        { label: window.i18n.t('search__type_songlist'), id: 'songlist' },
      ]
    })
    const handleTypeChange = (type) => {
      void router.replace({
        path: route.path,
        query: {
          ...route.query,
          type,
          page: 1,
        },
      })
    }


    return {
      sources,
      source,
      handleSourceChange,
      searchTypes,
      searchType,
      handleTypeChange,
      page,
      searchText,
    }
  },
}


</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.container {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  min-height: 0;
  padding: 10px 24px 16px;
  gap: 14px;
  box-sizing: border-box;
}

.header {
  flex: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 4px;
}

.sourceTabs,
.typeTabs {
  display: flex;
  flex-flow: row nowrap;
  gap: 6px;
  padding: 4px;
  border-radius: 999px;
  background: var(--color-primary-light-800-alpha-500);
}

.sourceTabs li,
.typeTabs li {
  border-radius: 999px;
  color: var(--color-font-label);
  font-size: 13px;
  transition: @transition-fast;
  transition-property: color, background-color, box-shadow;
  flex-shrink: 0;
}

.sourceTabs li:hover,
.typeTabs li:hover {
  color: var(--color-primary);
  background: var(--color-primary-light-900-alpha-700);
}

.sourceTabs li[aria-selected="true"],
.typeTabs li[aria-selected="true"] {
  color: var(--color-000);
  background: var(--color-primary);
  box-shadow: 0 2px 8px var(--color-primary-alpha-400);
}

.sourceTabs li[aria-selected="true"] span,
.typeTabs li[aria-selected="true"] span {
  color: var(--color-000);
}

.sourceTabs span,
.typeTabs span {
  padding: 6px 12px;
  font-size: 13px;
  line-height: 1.3;
}

.sourceTabs span:after,
.typeTabs span:after {
  display: none;
}

.main {
  position: relative;
  flex: auto;
  min-height: 0;
  overflow: hidden;
  border-radius: 16px;
  background: rgba(255, 255, 255, .42);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .04);
  backdrop-filter: none;
}
</style>
