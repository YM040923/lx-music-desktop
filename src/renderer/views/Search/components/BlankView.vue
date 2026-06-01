<template>
  <transition enter-active-class="animated-fast fadeIn" leave-active-class="animated-fast fadeOut">
    <div v-show="props.visible" :class="$style.noitem">
      <section :class="$style.historyPanel">
        <header :class="$style.historyHeader">
          <div :class="$style.heroIcon">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 30.239 30.239" space="preserve">
              <use xlink:href="#icon-search" />
            </svg>
          </div>
          <h2>{{ $t('history_search') }}</h2>
          <button v-if="historyList.length" type="button" :class="$style.historyClearBtn" :aria-label="$t('history_clear')" @click="clearHistoryList">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 512 512" space="preserve">
              <use xlink:href="#icon-eraser" />
            </svg>
          </button>
        </header>
        <div v-if="historyList.length" class="scroll" :class="$style.historyList">
          <button
            v-for="(item, index) in historyList" :key="index + item" type="button"
            :class="$style.historyItem" :aria-label="$t('history_remove')"
            @contextmenu="removeHistoryWord(index)" @click="handleSearch(item)"
          >
            {{ item }}
          </button>
        </div>
        <div v-else :class="$style.noitem_label">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 30.239 30.239" space="preserve">
            <use xlink:href="#icon-search" />
          </svg>
          <p>{{ $t('search__history_empty') }}</p>
        </div>
      </section>
    </div>
  </transition>
</template>

<script setup>
import { historyList } from '@renderer/store/search/state'
import { getHistoryList, removeHistoryWord, clearHistoryList } from '@renderer/store/search/action'
import { appSetting } from '@renderer/store/setting'
import { useRouter } from '@common/utils/vueRouter'

const props = defineProps({
  visible: Boolean,
  source: {
    type: String,
    required: true,
  },
})

if (appSetting['search.isShowHistorySearch']) {
  void getHistoryList()
}

const router = useRouter()
const handleSearch = (text) => {
  void router.replace({
    path: '/search',
    query: {
      text,
    },
  })
}

</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.noitem {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 26px 30px 30px;
}
.historyPanel {
  width: min(760px, 100%);
  max-height: 100%;
  display: flex;
  flex-flow: column nowrap;
  padding: 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, .48);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .58),
    0 12px 30px rgba(76, 103, 124, .08);
  box-sizing: border-box;
}
.historyHeader {
  flex: none;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;

  h2 {
    flex: auto;
    margin: 0;
    color: var(--color-font);
    font-size: 16px;
    line-height: 1.3;
    font-weight: 600;
  }
}
.heroIcon {
  flex: none;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: var(--color-primary);
  background: var(--color-primary-light-800-alpha-500);

  svg {
    width: 18px;
    height: 18px;
  }
}
.historyList {
  flex: auto;
  min-height: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
  padding: 2px 4px 4px;
}
.historyItem {
  display: block;
  background-color: var(--color-primary-light-800-alpha-500);
  border: none;
  padding: 8px 14px;
  border-radius: 999px;
  transition: @transition-fast;
  transition-property: background-color, color, box-shadow;
  cursor: pointer;
  color: var(--color-font);
  .mixin-ellipsis-1();
  max-width: 230px;
  font-size: 13px;
  &:hover {
    color: var(--color-000);
    background-color: var(--color-primary);
    box-shadow: 0 2px 10px var(--color-primary-alpha-400);
  }
  &:active {
    background-color: var(--color-primary-dark-100);
  }
}
.historyClearBtn {
  flex: none;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--color-font-label);
  cursor: pointer;
  transition: @transition-normal;
  transition-property: color, opacity, background-color;
  opacity: .72;
  &:hover {
    color: var(--color-primary-font-hover);
    background: var(--color-primary-light-800-alpha-500);
    opacity: 1;
  }
  &:active {
    color: var(--color-primary-font-active);
    opacity: 1;
  }
  svg {
    width: 15px;
    height: 15px;
  }
}

.noitem_label {
  flex: auto;
  min-height: 170px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--color-font-label);

  svg {
    width: 28px;
    height: 28px;
    opacity: .45;
  }

  p {
    margin: 0;
    font-size: 14px;
    text-align: center;
  }
}
</style>
