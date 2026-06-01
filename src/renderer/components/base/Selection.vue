<template>
  <div class="content" :class="[$style.select, show ? $style.active : '']">
    <div ref="dom_btn" class="label-content" :class="$style.label" @click="handleShow">
      <span class="label">{{ label }}</span>
      <div class="icon" :class="$style.icon">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 451.847 451.847" space="preserve">
          <use xlink:href="#icon-down" />
        </svg>
      </div>
    </div>
    <teleport to="#root">
      <ul v-if="show" ref="dom_list" class="selection-list scroll" :class="$style.list" :style="listStyles">
        <li
          v-for="(item, index) in list" :key="index" :class="[$style.listItem, (itemKey ? item[itemKey] : item) == modelValue ? $style.active : null]"
          :aria-label="itemName ? item[itemName] : item" @click="handleClick(item)"
        >
          {{ itemName ? item[itemName] : item }}
        </li>
      </ul>
    </teleport>
  </div>
</template>

<script>

export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
    itemName: {
      type: String,
      default: '',
    },
    itemKey: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      show: false,
      listStyles: {},
    }
  },
  computed: {
    activeIndex() {
      if (this.modelValue == null) return -1
      if (!this.itemName) return this.list.indexOf(this.modelValue)
      return this.list.findIndex(l => l[this.itemKey] == this.modelValue)
    },
    label() {
      if (this.modelValue == null) return ''
      if (this.itemName == null) return this.modelValue
      const item = this.list[this.activeIndex]
      if (!item) return ''
      return item[this.itemName]
    },
  },
  mounted() {
    document.addEventListener('click', this.handleHide, true)
    window.addEventListener('resize', this.updateListPosition)
    window.addEventListener('scroll', this.updateListPosition, true)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleHide, true)
    window.removeEventListener('resize', this.updateListPosition)
    window.removeEventListener('scroll', this.updateListPosition, true)
  },
  methods: {
    handleHide(e) {
      if (!this.show) return
      if (e && (e.target == this.$refs.dom_btn || this.$refs.dom_btn.contains(e.target))) return
      if (e && this.$refs.dom_list && (e.target == this.$refs.dom_list || this.$refs.dom_list.contains(e.target))) return
      this.show = false
    },
    handleClick(item) {
      this.show = false
      if (item === this.modelValue) return
      this.$emit('update:modelValue', this.itemKey ? item[this.itemKey] : item)
      this.$emit('change', item)
    },
    handleShow() {
      this.show = !this.show
      if (!this.show) return
      this.$nextTick(() => {
        this.updateListPosition()
        const activeItem = this.$refs.dom_list.children[this.activeIndex]
        if (activeItem) this.$refs.dom_list.scrollTop = activeItem.offsetTop - this.$refs.dom_list.clientHeight * 0.38
      })
    },
    updateListPosition() {
      if (!this.show || !this.$refs.dom_btn) return
      const rect = this.$refs.dom_btn.getBoundingClientRect()
      const gap = 6
      const viewportGap = 12
      const preferredHeight = Math.min(280, Math.max(120, this.list.length * 42 + 12))
      const spaceBelow = window.innerHeight - rect.bottom - viewportGap
      const spaceAbove = rect.top - viewportGap
      const placeAbove = spaceBelow < Math.min(preferredHeight, 180) && spaceAbove > spaceBelow
      const maxHeight = Math.max(120, Math.min(preferredHeight, placeAbove ? spaceAbove - gap : spaceBelow - gap))
      this.listStyles = {
        left: `${rect.left}px`,
        top: `${placeAbove ? Math.max(viewportGap, rect.top - maxHeight - gap) : rect.bottom + gap}px`,
        width: `${rect.width}px`,
        maxHeight: `${maxHeight}px`,
      }
    },
    handleGetOffset() {
      const listHeight = this.$refs.dom_list.clientHeight
      const dom_select = this.$refs.dom_list.offsetParent
      const dom_container = dom_select.offsetParent
      const containerHeight = dom_container.clientHeight
      if (containerHeight < listHeight) return 0
      const offsetHeight = (dom_container.scrollTop + containerHeight) - (dom_select.offsetTop + listHeight)
      if (offsetHeight > 0) return 0
      return offsetHeight - 5
    },
  },
}
</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

@selection-height: 28px;

.select {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  position: relative;
  width: var(--selection-width, 300px);

  &.active {
    .label {
      background-color: var(--color-button-background);
    }
    .list {
      opacity: 1;
    }
    .icon {
      svg{
        transform: rotate(180deg);
      }
    }
  }
}

.label {
  background-color: var(--color-button-background);
  padding: 0 10px;
  transition: background-color @transition-normal;
  height: @selection-height;
  // line-height: 27px;
  line-height: 1.5;
  box-sizing: border-box;
  color: var(--color-button-font);
  border-radius: @form-radius;
  cursor: pointer;
  display: flex;
  align-items: center;

  span {
    flex: auto;
    .mixin-ellipsis-1();
  }
  .icon {
    flex: none;
    margin-left: 7px;
    line-height: 0;
    svg {
      width: 1em;
      transition: transform .2s ease;
      transform: rotate(0);
    }
  }

  &:hover {
    background-color: var(--color-button-background-hover);
  }
  &:active {
    background-color: var(--color-button-background-active);
  }
}

.list {
  position: fixed;
  background: rgba(255, 255, 255, .96);
  opacity: 1;
  z-index: 3000;
  padding: 6px;
  border-radius: 12px;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .72),
    0 18px 42px rgba(76, 103, 124, .18);
  overflow: auto;
  box-sizing: border-box;
  backdrop-filter: blur(18px) saturate(1.08);
  -webkit-backdrop-filter: blur(18px) saturate(1.08);
}
.listItem {
  cursor: pointer;
  padding: 0 12px;
  line-height: 34px;
  color: var(--color-font);
  outline: none;
  border-radius: 8px;
  transition: @transition-fast;
  transition-property: color, background-color;
  background-color: transparent;
  box-sizing: border-box;
  .mixin-ellipsis-1();

  &:hover {
    background-color: var(--color-button-background-hover);
  }
  &:active {
    background-color: var(--color-button-background-active);
  }
  &.active {
    color: var(--color-primary);
    font-weight: 600;
    background-color: var(--color-primary-light-900-alpha-600);
  }
}


</style>
