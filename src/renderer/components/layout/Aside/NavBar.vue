<template>
  <nav ref="dom_menu" :class="$style.menu" aria-label="Primary">
    <ul :class="$style.list" role="toolbar">
      <li v-for="item in menus" :key="item.to" :class="$style.navItem" role="presentation">
        <router-link
          :class="[$style.link, { [$style.active]: $route.meta.name == item.name }]"
          role="tab"
          :aria-selected="$route.meta.name == item.name"
          :to="item.to"
          :aria-label="item.tips"
        >
          <span :class="$style.itemInner">
            <svg
              :class="$style.icon"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xlink="http://www.w3.org/1999/xlink"
              :viewBox="item.iconSize"
              space="preserve"
            >
              <use :xlink:href="item.icon" />
            </svg>
            <span :class="$style.label">{{ item.tips }}</span>
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { appSetting } from '@renderer/store/setting'
import { useI18n } from '@root/lang'
import { ref, computed } from '@common/utils/vueTools'
import { useIconSize } from '@renderer/utils/compositions/useIconSize'

export default {
  name: 'NavBar',
  setup() {
    const t = useI18n()
    const dom_menu = ref<HTMLElement>()
    const iconSize = useIconSize(dom_menu, 0.32)

    const menus = computed(() => {
      const size = iconSize.value
      return [
        {
          to: '/search',
          tips: t('search'),
          icon: '#icon-search-2',
          iconSize: '0 0 425.2 425.2',
          size,
          name: 'Search',
          enable: true,
        },
        {
          to: '/songList/list',
          tips: t('song_list'),
          icon: '#icon-album',
          iconSize: '0 0 425.2 425.2',
          size,
          name: 'SongList',
          enable: true,
        },
        {
          to: '/leaderboard',
          tips: t('leaderboard'),
          icon: '#icon-leaderboard',
          iconSize: '0 0 425.22 425.2',
          size,
          name: 'Leaderboard',
          enable: true,
        },
        {
          to: '/list',
          tips: t('my_list'),
          icon: '#icon-love',
          iconSize: '0 0 444.87 391.18',
          size,
          name: 'List',
          enable: true,
        },
        {
          to: '/download',
          tips: t('download'),
          icon: '#icon-download-2',
          iconSize: '0 0 425.2 425.2',
          size,
          enable: appSetting['download.enable'],
          name: 'Download',
        },
        {
          to: '/setting',
          tips: t('setting'),
          icon: '#icon-setting',
          iconSize: '0 0 493.23 436.47',
          size,
          enable: true,
          name: 'Setting',
        },
      ].filter(m => m.enable)
    })
    return {
      appSetting,
      menus,
      dom_menu,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.menu {
  flex: auto;
  min-height: 0;
  display: flex;
  align-items: stretch;
  -webkit-app-region: no-drag;
}
.list {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  gap: 12px;
  padding: 4px 0;
  -webkit-app-region: no-drag;
}
.navItem {
  flex: none;
}
.link {
  width: 100%;
  min-height: 76px;
  box-sizing: border-box;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-font-label);
  cursor: pointer;
  outline: none;
  text-decoration: none;
  font-family: "Segoe UI", "Microsoft YaHei UI", "Microsoft YaHei", sans-serif;
  font-size: 12px;
  font-weight: 400;
  transition: color @transition-fast, opacity @transition-fast, transform @transition-fast;
  .mixin-ellipsis-1();

  &.active {
    color: var(--color-primary);
    font-weight: 500;
  }

  &:hover {
    &:not(.active) {
      color: var(--color-nav-font);
      transform: translateY(-1px);
    }
  }

  &:active:not(.active) {
    opacity: .75;
    transform: translateY(0);
  }
}

.itemInner {
  width: 100%;
  min-height: 66px;
  padding: 8px 8px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: transparent;
  box-sizing: border-box;
  transition: transform @transition-fast;

  .link:not(.active):hover & {
    transform: translateY(-1px);
  }
}

.icon {
  width: 25px;
  height: 25px;
  flex: none;
  fill: currentColor;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.16));
  opacity: .85;

  .active & {
    opacity: 1;
  }
}

.label {
  max-width: 88%;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.1;
  letter-spacing: 0;
  text-align: center;
  background-color: transparent;
  transition: background-color @transition-fast, box-shadow @transition-fast, color @transition-fast;
  .mixin-ellipsis-1();

  .active & {
    color: #fff;
    background-color: var(--color-primary);
    box-shadow: 0 8px 20px var(--color-primary-alpha-600);
  }

  .link:not(.active):hover & {
    background-color: var(--color-primary-light-600-alpha-800);
  }
}

</style>
