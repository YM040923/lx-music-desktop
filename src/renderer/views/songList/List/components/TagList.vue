<template>
  <div :class="[$style.tagList, {[$style.active]: popupVisible}]">
    <div ref="dom_btn" :class="$style.label" @click.stop="handleShow">
      <span>{{ tagName }}</span>
      <div :class="$style.icon">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="100%" viewBox="0 0 451.847 451.847" space="preserve">
          <use xlink:href="#icon-down" />
        </svg>
      </div>
    </div>
    <teleport to="#root">
      <div
        v-if="popupVisible"
        :class="$style.popup"
        :style="popupStyle"
        aria-hidden="false"
        @click.stop
      >
        <div :class="$style.list" class="scroll">
          <div :class="$style.tag" @click="handleToggleTag('')">{{ $t('default') }}</div>
          <dl v-for="tagInfo in list" :key="tagInfo.name">
            <dt :class="$style.type">{{ tagInfo.name }}</dt>
            <dd v-for="tag in tagInfo.list" :key="tag.id" :class="$style.tag" @click="handleToggleTag(tag.id)">{{ tag.name }}</dd>
          </dl>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { watch, shallowReactive, ref, onMounted, onBeforeUnmount, computed, reactive } from '@common/utils/vueTools'
import { setTags, getTags } from '@renderer/store/songList/action'
import { tags } from '@renderer/store/songList/state'
import { useRouter, useRoute } from '@common/utils/vueRouter'
import { useI18n } from '@renderer/plugins/i18n'

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
  tagId: {
    type: String,
    required: true,
  },
  sortId: {
    type: [String, undefined],
    default: undefined,
  },
})

const router = useRouter()
const route = useRoute()
const t = useI18n()

const list = shallowReactive([])
const handleToggleTag = (id) => {
  void router.replace({
    path: route.path,
    query: {
      source: props.source,
      tagId: id,
      sortId: props.sortId,
    },
  })
  handleHide()
}
watch(() => props.source, async(source) => {
  if (!source) return
  // const source = (await getLeaderboardSetting()).source as LX.OnlineSource
  let tagInfo = tags[source]
  // console.log(await getTags(source))
  if (tagInfo == null) setTags(tagInfo = await getTags(source), source)

  list.splice(0, list.length, ...[{ name: window.i18n.t('songlist__tag_info_hot_tag'), list: [...tagInfo.hotTag] }, ...tagInfo.tags])
}, {
  immediate: true,
})
const tagName = computed(() => {
  if (!props.tagId) return t('default')
  for (const tags of list) {
    const tag = tags.list.find(t => t.id == props.tagId)
    if (tag) return tag.name
  }
  return props.tagId
})

const popupStyle = reactive({
  left: '180px',
  top: '168px',
  width: 'calc(100vw - 220px)',
  maxHeight: 'calc(100vh - 280px)',
})

const setTagPopupWidth = () => {
  const dom_view = document.getElementById('view')
  if (!dom_view || !dom_btn.value) return
  const viewRect = dom_view.getBoundingClientRect()
  const btnRect = dom_btn.value.getBoundingClientRect()
  const sideGap = 24
  popupStyle.left = `${viewRect.left + sideGap}px`
  popupStyle.top = `${btnRect.bottom + 10}px`
  popupStyle.width = `${Math.max(320, viewRect.width - sideGap * 2)}px`
  popupStyle.maxHeight = `${Math.max(220, window.innerHeight - btnRect.bottom - 132)}px`
}

const dom_btn = ref<HTMLElement | null>(null)
const popupVisible = ref(false)
const handleShow = () => {
  popupVisible.value = !popupVisible.value
  if (popupVisible.value) setTagPopupWidth()
}
const handleHide = (evt) => {
  // if (e && e.target.parentNode != this.$refs.dom_popup && this.show) return this.show = false
  // console.log(this.$refs)
  if (evt && (evt.target == dom_btn.value || dom_btn.value?.contains(evt.target))) return
  popupVisible.value = false
}


onMounted(() => {
  setTagPopupWidth()
  document.addEventListener('click', handleHide)
  window.addEventListener('resize', setTagPopupWidth)
  window.addEventListener('scroll', setTagPopupWidth, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleHide)
  window.removeEventListener('resize', setTagPopupWidth)
  window.removeEventListener('scroll', setTagPopupWidth, true)
})

</script>


<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.tagList {
  font-size: 12px;
  position: relative;

  &.active {
    .label {
      .icon {
        svg{
          transform: rotate(180deg);
        }
      }
    }
  }
}

.label {
  padding: 8px 14px;
  border-radius: @form-radius;
  background: var(--color-primary-light-800-alpha-500);
  transition: background-color @transition-fast, color @transition-fast;
  box-sizing: border-box;
  color: var(--color-font);
  cursor: pointer;
  font-size: 13px;

  display: flex;
  align-items: center;
  gap: 6px;

  .icon {
    flex: none;
    line-height: 0;
    svg {
      width: 10px;
      transition: transform .2s ease;
    }
  }

  &:hover {
    background: var(--color-primary-light-500-alpha-500);
  }
}

.popup {
  position: fixed;
  border-radius: 16px;
  background: rgba(255, 255, 255, .96);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .7),
    0 18px 42px rgba(76, 103, 124, .18);
  max-height: 320px;
  z-index: 3200;
  display: flex;
  backdrop-filter: blur(18px) saturate(1.08);
  -webkit-backdrop-filter: blur(18px) saturate(1.08);
  overflow: hidden;
}
.list {
  padding: 12px;
  box-sizing: border-box;
}

.type {
  padding-top: 12px;
  padding-bottom: 4px;
  font-size: 12px;
  color: var(--color-font-label);
}

.tag {
  display: inline-block;
  margin: 4px;
  background-color: var(--color-primary-light-800-alpha-500);
  padding: 8px 12px;
  border-radius: @form-radius;
  font-size: 13px;
  transition: background-color @transition-fast, color @transition-fast;
  cursor: pointer;
  &:hover {
    background-color: var(--color-primary);
    color: #fff;
  }
}

</style>
