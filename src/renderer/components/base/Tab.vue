<template>
  <ul :class="[$style.list, $style[align]]" role="tablist">
    <li
      v-for="item in list"
      :key="item[itemKey]" :class="[$style.listItem, {[$style.active]: modelValue == item[itemKey]}]" tabindex="-1" role="tab"
      :aria-label="item[itemLabel]" ignore-tip :aria-selected="modelValue == item[itemKey]" @click="handleToggle(item[itemKey])"
    >
      <span :class="$style.label">{{ item[itemLabel] }}</span>
    </li>
  </ul>
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
    align: {
      type: String,
      default: 'left',
    },
    itemKey: {
      type: String,
      default: 'id',
    },
    itemLabel: {
      type: String,
      default: 'label',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const handleToggle = id => {
      if (id == props.modelValue) return
      emit('update:modelValue', id)
      emit('change', id)
    }

    return {
      handleToggle,
    }
  },
}
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.list {
  display: flex;
  flex-flow: row nowrap;
  font-size: 13px;
  gap: 4px;
  padding: 4px;
  border-radius: @form-radius;
  background: var(--color-primary-light-800-alpha-500);

  &.left { justify-content: flex-start; }
  &.center { justify-content: center; }
  &.right { justify-content: flex-end; }
}

.listItem {
  display: block;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color @transition-fast, color @transition-fast;

  &:hover {
    color: var(--color-primary);
    background: var(--color-primary-light-900-alpha-700);
  }

  &.active {
    color: var(--color-000);
    cursor: default;
    background: var(--color-primary);
    box-shadow: 0 2px 8px var(--color-primary-alpha-400);

    >.label {
      &:after { display: none; }
    }
  }
}

.label {
  display: block;
  position: relative;
  padding: 6px 14px;
  font-size: 13px;
  line-height: 1.4;
}

</style>
