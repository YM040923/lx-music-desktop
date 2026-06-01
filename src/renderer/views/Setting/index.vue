<template>
  <div :class="$style.main">
    <div class="scroll" :class="$style.toc">
      <ul :class="$style.tocList" role="toolbar">
        <li v-for="h2 in tocList" :key="h2.id" :class="$style.tocListItem" role="presentation">
          <h2
            :class="[$style.tocH2, {[$style.active]: avtiveComponentName == h2.id }]"
            role="tab" :aria-selected="avtiveComponentName == h2.id"
            :aria-label="h2.title" ignore-tip @click="toggleTab(h2.id)"
          >
            <transition name="list-active">
              <svg-icon v-if="avtiveComponentName == h2.id" name="angle-right-solid" :class="$style.activeIcon" />
            </transition>
            {{ h2.title }}
          </h2>
          <!-- <ul v-if="h2.children.length" :class="$style.tocList">
            <li v-for="h3 in h2.children" :key="h3.id" :class="$style.tocSubListItem">
              <h3 :class="[$style.tocH3, toc.activeId == h3.id ? $style.active : null]" :aria-label="h3.title">
                <a :href="'#' + h3.id" @click.stop="toc.activeId = h3.id">{{ h3.title }}</a>
              </h3>
            </li>
          </ul> -->
        </li>
      </ul>
    </div>
    <div ref="dom_content_ref" class="scroll" :class="$style.setting">
      <dl>
        <component :is="avtiveComponentName" />
        <!-- <SettingBasic />
        <SettingPlay />
        <SettingPlayDetail />
        <SettingDesktopLyric />
        <SettingSearch />
        <SettingList />
        <SettingDownload />
        <SettingSync />
        <SettingHotKey />
        <SettingNetwork />
        <SettingOdc />
        <SettingBackup />
        <SettingOther />
        <SettingUpdate />
        <SettingAbout /> -->
      </dl>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from '@common/utils/vueTools'
// import { currentStting } from './setting'
import { useI18n } from '@renderer/plugins/i18n'
import { useRoute } from '@common/utils/vueRouter'

import SettingBasic from './components/SettingBasic.vue'
import SettingPlay from './components/SettingPlay.vue'
import SettingPlayDetail from './components/SettingPlayDetail.vue'
import SettingDesktopLyric from './components/SettingDesktopLyric.vue'
import SettingSearch from './components/SettingSearch.vue'
import SettingList from './components/SettingList.vue'
import SettingDownload from './components/SettingDownload.vue'
import SettingSync from './components/SettingSync/index.vue'
import SettingOpenAPI from './components/SettingOpenAPI.vue'
import SettingHotKey from './components/SettingHotKey.vue'
import SettingNetwork from './components/SettingNetwork.vue'
import SettingOdc from './components/SettingOdc.vue'
import SettingBackup from './components/SettingBackup.vue'
import SettingOther from './components/SettingOther.vue'
import SettingUpdate from './components/SettingUpdate.vue'
import SettingAbout from './components/SettingAbout.vue'

export default {
  name: 'Setting',
  components: {
    SettingBasic,
    SettingPlay,
    SettingPlayDetail,
    SettingDesktopLyric,
    SettingSearch,
    SettingList,
    SettingDownload,
    SettingSync,
    SettingOpenAPI,
    SettingHotKey,
    SettingNetwork,
    SettingOdc,
    SettingBackup,
    SettingOther,
    SettingUpdate,
    SettingAbout,
  },
  setup() {
    const t = useI18n()
    const route = useRoute()

    const dom_content_ref = ref(null)

    const tocList = computed(() => {
      return [
        { id: 'SettingBasic', title: t('setting__basic') },
        { id: 'SettingPlay', title: t('setting__play') },
        { id: 'SettingPlayDetail', title: t('setting__play_detail') },
        { id: 'SettingDesktopLyric', title: t('setting__desktop_lyric') },
        { id: 'SettingSearch', title: t('setting__search') },
        { id: 'SettingList', title: t('setting__list') },
        { id: 'SettingDownload', title: t('setting__download') },
        { id: 'SettingHotKey', title: t('setting__hot_key') },
        { id: 'SettingSync', title: t('setting__sync') },
        { id: 'SettingOpenAPI', title: t('setting__open_api') },
        { id: 'SettingNetwork', title: t('setting__network') },
        { id: 'SettingOdc', title: t('setting__odc') },
        { id: 'SettingBackup', title: t('setting__backup') },
        { id: 'SettingOther', title: t('setting__other') },
        { id: 'SettingUpdate', title: t('setting__update') },
        { id: 'SettingAbout', title: t('setting__about') },
      ]
    })

    const avtiveComponentName = ref(route.query.name && tocList.value.some(t => t.id == route.query.name)
      ? route.query.name
      : tocList.value[0].id)

    const toggleTab = id => {
      avtiveComponentName.value = id
      void nextTick(() => {
        dom_content_ref.value?.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      })
    }

    return {
      tocList,
      avtiveComponentName,
      dom_content_ref,
      toggleTab,
    }
  },
  // mounted() {
  //   this.initTOC()
  // },
  // methods: {
  //   initTOC() {
  //     const list = this.$refs.dom_setting_list.children
  //     const toc = []
  //     let prevTitle
  //     for (const item of list) {
  //       if (item.tagName == 'DT') {
  //         prevTitle = {
  //           title: item.innerText.replace(/[（(].+?[)）]/, ''),
  //           id: item.getAttribute('id'),
  //           dom: item,
  //           children: [],
  //         }
  //         toc.push(prevTitle)
  //         continue
  //       }
  //       const h3 = item.querySelector('h3')
  //       if (h3) {
  //         prevTitle.children.push({
  //           title: h3.innerText.replace(/[（(].+?[)）]/, ''),
  //           id: h3.getAttribute('id'),
  //           dom: h3,
  //         })
  //       }
  //     }
  //     console.log(toc)
  //     this.toc.list = toc
  //   },
  //   handleListScroll(event) {
  //     // console.log(event.target.scrollTop)
  //   },
  // },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.main {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  padding: 22px 30px 26px;
  gap: 22px;
  box-sizing: border-box;
  color: rgba(31, 43, 54, .84);
}

.toc {
  flex: none;
  width: 190px;
  overflow-y: scroll;
  border-radius: 16px;
  background: rgba(255, 255, 255, .52);
  backdrop-filter: blur(26px) saturate(1.12);
  -webkit-backdrop-filter: blur(26px) saturate(1.12);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .58),
    0 14px 34px rgba(76, 103, 124, .10);
  padding: 10px 0;
}
.tocH2 {
  line-height: 1.5;
  .mixin-ellipsis-1();
  font-size: 13px;
  color: rgba(43, 58, 71, .68);
  padding: 10px 15px;
  margin: 0 8px 2px;
  border-radius: 10px;
  transition: background-color @transition-fast, color @transition-fast, box-shadow @transition-fast;
  cursor: pointer;

  &:not(.active) {
    &:hover {
      color: rgba(29, 43, 56, .86);
      background-color: rgba(255, 255, 255, .46);
    }
  }
  &.active {
    color: var(--color-primary);
    font-weight: 600;
    background-color: rgba(255, 255, 255, .66);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, .62),
      0 8px 18px rgba(76, 103, 124, .10);
  }
}
.activeIcon {
  height: .9em;
  width: .9em;
  margin-right: 4px;
  vertical-align: -0.05em;
}

.setting {
  flex: auto;
  overflow-y: auto;
  height: 100%;
  padding: 4px 8px 28px;
  font-size: 14px;
  box-sizing: border-box;
  border-radius: 0;
  background: transparent;
  box-shadow: none;

  :global {
    dl {
      max-width: 940px;
      margin: 0 auto;
      padding-bottom: 10px;
    }

    dt {
      padding: 0 4px;
      margin: 0 0 14px;
      font-size: 18px;
      font-weight: 650;
      color: rgba(29, 43, 56, .9);

      + dd h3 { margin-top: 0; }
    }

    dd {
      margin: 0 0 12px;
      padding: 16px 18px;
      border-radius: 16px;
      background: rgba(255, 255, 255, .50);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, .58),
        0 12px 28px rgba(76, 103, 124, .09);
      backdrop-filter: blur(22px) saturate(1.08);
      -webkit-backdrop-filter: blur(22px) saturate(1.08);
    }

    dd > div { padding: 0; }
    h3 {
      font-size: 13px;
      margin: 0 0 12px;
      color: rgba(43, 58, 71, .76);
      font-weight: 650;
    }
    .p {
      padding: 4px 0;
      line-height: 1.5;
    }
  }
}

</style>
