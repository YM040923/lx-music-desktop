<template>
  <div v-if="maxPage > 1" :class="$style.pagination">
    <ul>
      <li v-if="page == 1" :class="$style.disabled">
        <span>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 451.846 451.847" space="preserve">
            <use xlink:href="#icon-left" />
          </svg>
        </span>
      </li>
      <li v-else>
        <button type="button" :aria-label="$t('pagination__prev')" @click="handleClick(page - 1)">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 451.846 451.847" space="preserve">
            <use xlink:href="#icon-left" />
          </svg>
        </button>
      </li>
      <li v-if="maxPage > btnLength && page > pageEvg+1" :class="$style.first">
        <button type="button" :aria-label="$t('pagination__page', { num: 1 })" @click="handleClick(1)">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 451.846 451.847" space="preserve">
            <use xlink:href="#icon-first" />
          </svg>
        </button>
      </li>
      <li v-for="p in pages" :key="p" :class="{[$style.active] : p == page}">
        <span v-if="p === page" v-text="page" />
        <button v-else type="button" :aria-label="$t('pagination__page', { num: p })" @click="handleClick(p)" v-text="p" />
      </li>
      <li v-if="maxPage > btnLength && maxPage - page > pageEvg" :class="$style.last">
        <button type="button" :aria-label="$t('pagination__page', { num: maxPage })" @click="handleClick(maxPage)">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 451.846 451.847" space="preserve">
            <use xlink:href="#icon-last" />
          </svg>
        </button>
      </li>
      <li v-if="page == maxPage" :class="$style.disabled">
        <span>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 451.846 451.847" space="preserve">
            <use xlink:href="#icon-right" />
          </svg></span>
      </li>
      <li v-else>
        <button type="button" :aria-label="$t('pagination__next')" @click="handleClick(page + 1)">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 451.846 451.847" space="preserve">
            <use xlink:href="#icon-right" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from '@common/utils/vueTools'

export default {
  props: {
    count: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 10,
    },
    page: {
      type: Number,
      default: 1,
    },
    btnLength: {
      type: Number,
      default: 7,
    },
  },
  emits: ['btn-click'],
  setup(props, { emit }) {
    const maxPage = computed(() => {
      return Math.ceil(props.count / props.limit) || 1
    })
    const pageEvg = computed(() => {
      return Math.floor(props.btnLength / 2)
    })
    const pages = computed(() => {
      if (maxPage.value <= props.btnLength) return Array.from({ length: maxPage.value }, (_, i) => i + 1)
      let start = props.page - pageEvg.value > 1
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        ? maxPage.value - props.page < pageEvg.value + 1
          ? maxPage.value - (props.btnLength - 1)
          : props.page - pageEvg.value
        : 1
      return Array.from({ length: props.btnLength }, (_, i) => start + i)
    })

    const handleClick = (page) => {
      emit('btn-click', page)
    }

    return {
      maxPage,
      pageEvg,
      pages,
      handleClick,
    }
  },
}
</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.pagination {
  display: inline-flex;
  max-width: 100%;
  border-radius: 999px;
  background: rgba(255, 255, 255, .56);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .62),
    0 8px 22px rgba(76, 103, 124, .1);
  ul {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 3px;
    padding: 4px;
    li {
      display: flex;
      flex: none;
      line-height: 1;
      svg {
        width: 13px;
        height: 13px;
      }
      span,
      button {
        min-width: 30px;
        height: 30px;
        padding: 0 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        color: var(--color-font-label);
        font-size: 13px;
        line-height: 1;
        box-sizing: border-box;
      }
      &.active {
        span {
          color: var(--color-000);
          background: var(--color-primary);
          box-shadow: 0 3px 10px var(--color-primary-alpha-400);
        }
      }
      button {
        background: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        transition: @transition-fast;
        transition-property: background-color, color, transform;
        &:hover {
          color: var(--color-primary);
          background: var(--color-primary-light-800-alpha-500);
        }
        &:active {
          transform: scale(.94);
          background: var(--color-primary-light-700-alpha-600);
        }
      }
      &.disabled {
        span {
          opacity: .28;
        }
      }
      &:first-child, &:last-child, &.first, &.last {
        span,
        button {
          line-height: 0;
        }
      }
    }
  }
}


</style>
