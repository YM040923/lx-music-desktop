<template>
  <div ref="btnRef" :class="[$style.btnContent, { [$style.playDetailContent]: props.playDetail }]">
    <button
      :class="[props.playDetail ? $style.playDetailBtn : (props.buttonClass || $style.btn), { [$style.active]: !!timeLabel || visible }]"
      :aria-label="$t('player__start_timer')"
      @click.stop="toggleVisible"
    >
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 24 24" space="preserve">
        <use xlink:href="#icon-start-timer" />
      </svg>
    </button>
    <teleport to="#root">
      <div v-if="visible" :class="$style.drawer" @click.stop>
        <div :class="$style.panel">
        <div :class="$style.header">
          <h3>{{ $t('player__start_timer') }}</h3>
          <span v-if="timeLabel">{{ $t('player__start_timer_running', { time: timeLabel }) }}</span>
          <span v-else>{{ $t('player__start_timer_empty') }}</span>
        </div>

        <div :class="$style.tabs">
          <button :class="{ [$style.selected]: mode == 'duration' }" @click="mode = 'duration'">{{ $t('player__start_timer_duration') }}</button>
          <button :class="{ [$style.selected]: mode == 'clock' }" @click="mode = 'clock'">{{ $t('player__start_timer_clock') }}</button>
        </div>

        <div v-if="mode == 'duration'" :class="$style.content">
          <div :class="$style.quickList">
            <button v-for="item in quickDurations" :key="item.minutes" @click="setQuickDuration(item.minutes)">{{ item.label }}</button>
          </div>
          <div :class="$style.inputs">
            <label>
              <span>{{ $t('player__start_timer_hours') }}</span>
              <input v-model="durationHours" min="0" step="0.5" type="number">
            </label>
            <label>
              <span>{{ $t('player__start_timer_minutes') }}</span>
              <input v-model="durationMinutes" min="0" max="59" step="1" type="number">
            </label>
          </div>
        </div>

        <div v-else :class="$style.content">
          <label :class="$style.clockInput">
            <span>{{ $t('player__start_timer_beijing_time') }}</span>
            <input v-model="clockTime" type="time">
          </label>
          <div :class="$style.weekdays">
            <span>{{ $t('player__start_timer_weekdays') }}</span>
            <div :class="$style.weekdayList">
              <button
                v-for="item in weekdayOptions"
                :key="item.value"
                :class="{ [$style.weekdaySelected]: selectedWeekdays.includes(item.value) }"
                @click="toggleWeekday(item.value)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
          <p :class="$style.hint">{{ $t('player__start_timer_clock_tip') }}</p>
        </div>

        <div :class="$style.summary">
          <span v-if="!playMusicInfo.musicInfo">{{ $t('player__start_timer_no_music') }}</span>
          <span v-else-if="delaySeconds > 0">{{ planText }}</span>
          <span v-else>{{ $t('player__start_timer_invalid') }}</span>
        </div>

        <div :class="$style.footer">
          <base-btn min :disabled="!timeLabel" @click="stopTimeoutStart">{{ $t('player__start_timer_cancel') }}</base-btn>
          <base-btn min :disabled="!canStart" @click="handleStart">{{ $t('player__start_timer_confirm') }}</base-btn>
        </div>
      </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from '@common/utils/vueTools'
import {
  getDelaySecondsByBeijingClock,
  getDelaySecondsByBeijingClockWeekdays,
  getDelaySecondsByDuration,
  startTimeoutStart,
  startTimeoutStartRepeat,
  stopTimeoutStart,
  useTimeoutStart,
} from '@renderer/core/player'
import { playMusicInfo } from '@renderer/store/player/state'
import { useI18n } from '@renderer/plugins/i18n'

const props = defineProps<{
  buttonClass?: string
  playDetail?: boolean
}>()

const emit = defineEmits<(event: 'show') => void>()

const btnRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const t = useI18n()
const mode = ref<'duration' | 'clock'>('duration')
const durationHours = ref('1')
const durationMinutes = ref('0')
const clockTime = ref('08:00')
const selectedWeekdays = ref<number[]>([])
const { timeLabel } = useTimeoutStart()

const quickDurations = [
  { label: '30m', minutes: 30 },
  { label: '1h', minutes: 60 },
  { label: '2h', minutes: 120 },
]

const weekdayOptions = [
  { label: t('player__start_timer_weekday_1'), value: 1 },
  { label: t('player__start_timer_weekday_2'), value: 2 },
  { label: t('player__start_timer_weekday_3'), value: 3 },
  { label: t('player__start_timer_weekday_4'), value: 4 },
  { label: t('player__start_timer_weekday_5'), value: 5 },
  { label: t('player__start_timer_weekday_6'), value: 6 },
  { label: t('player__start_timer_weekday_7'), value: 7 },
]

const delaySeconds = computed(() => {
  if (mode.value == 'duration') {
    return getDelaySecondsByDuration(Number(durationHours.value), Number(durationMinutes.value))
  }
  return selectedWeekdays.value.length
    ? getDelaySecondsByBeijingClockWeekdays(clockTime.value, selectedWeekdays.value)
    : getDelaySecondsByBeijingClock(clockTime.value)
})

const planLabel = computed(() => {
  const target = new Date(Date.now() + delaySeconds.value * 1000)
  const h = ((target.getUTCHours() + 8) % 24).toString().padStart(2, '0')
  const m = target.getUTCMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
})

const canStart = computed(() => {
  return !!playMusicInfo.musicInfo && delaySeconds.value > 0
})

const planText = computed(() => {
  if (mode.value != 'clock' || !selectedWeekdays.value.length) {
    return t('player__start_timer_plan', { time: planLabel.value })
  }
  const days = weekdayOptions
    .filter(item => selectedWeekdays.value.includes(item.value))
    .map(item => item.label)
    .join(' ')
  return t('player__start_timer_weekly_plan', { days, time: clockTime.value })
})

const setQuickDuration = (minutes: number) => {
  durationHours.value = Math.trunc(minutes / 60).toString()
  durationMinutes.value = (minutes % 60).toString()
}

const toggleWeekday = (weekday: number) => {
  if (selectedWeekdays.value.includes(weekday)) {
    selectedWeekdays.value = selectedWeekdays.value.filter(day => day != weekday)
  } else {
    selectedWeekdays.value = [...selectedWeekdays.value, weekday].sort((a, b) => a - b)
  }
}

const handleStart = () => {
  if (!canStart.value) return
  if (mode.value == 'clock') {
    startTimeoutStartRepeat(delaySeconds.value, clockTime.value, selectedWeekdays.value)
  } else {
    startTimeoutStart(delaySeconds.value)
  }
}

const show = () => {
  visible.value = true
  emit('show')
}

const hide = () => {
  visible.value = false
}

const toggleVisible = () => {
  if (visible.value) hide()
  else show()
}

const handleDocumentClick = () => {
  hide()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style lang="less" module>
@import '@renderer/assets/styles/layout.less';

.btnContent {
  display: contents;
}

.playDetailContent {
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  display: flex;
}

.btn {
  position: relative;
  justify-content: center;
  align-items: center;
  transition: color @transition-normal;
  cursor: pointer;
  background-color: transparent;
  border: none;
  width: 24px;
  display: flex;
  flex-flow: column nowrap;
  padding: 0;

  svg {
    transition: opacity @transition-fast;
    opacity: .5;
  }

  &:hover svg {
    opacity: .9;
  }

  &:active svg {
    opacity: 1;
  }
}

.playDetailBtn {
  width: 38px;
  min-width: 38px;
  height: 38px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, .38);
  color: rgba(35, 54, 67, .72);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .52),
    0 10px 24px rgba(76, 103, 124, .12);
  transition:
    transform @transition-fast,
    background-color @transition-fast,
    color @transition-fast,
    box-shadow @transition-fast;

  svg {
    width: 21px !important;
    height: 21px !important;
    fill: currentColor;
    color: currentColor;
    opacity: 1 !important;
  }

  &:hover {
    color: var(--color-primary);
    background: rgba(255, 255, 255, .58);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, .62),
      0 14px 28px rgba(76, 103, 124, .16);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(.96);
  }
}

.active {
  color: var(--color-primary) !important;
}

.drawer {
  position: fixed;
  right: 24px;
  bottom: 116px;
  width: min(360px, calc(100vw - 48px));
  z-index: 3200;
  border-radius: 16px;
  background: rgba(255, 255, 255, .98);
  backdrop-filter: blur(18px) saturate(1.06);
  -webkit-backdrop-filter: blur(18px) saturate(1.06);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .8),
    0 18px 48px rgba(76, 103, 124, .24);
  overflow: hidden;
  box-sizing: border-box;
  animation: drawerIn @transition-normal;
}

.panel {
  padding: 14px;
  display: flex;
  flex-flow: column nowrap;
  gap: 12px;
  color: var(--color-font);
}

@keyframes drawerIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  display: flex;
  flex-flow: column nowrap;
  gap: 4px;

  h3 {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }

  span {
    font-size: 12px;
    line-height: 18px;
    color: var(--color-font-label);
  }
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 4px;
  border-radius: 10px;
  background: var(--color-primary-light-300-alpha-500);

  button {
    height: 30px;
    border: none;
    border-radius: 8px;
    color: var(--color-font-label);
    background: transparent;
    cursor: pointer;
    transition: background-color @transition-fast, color @transition-fast;

    &.selected {
      color: var(--color-primary);
      background: rgba(255, 255, 255, .92);
    }
  }
}

.content {
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
}

.quickList {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;

  button {
    height: 30px;
    border: none;
    border-radius: 8px;
    color: var(--color-font);
    background: var(--color-primary-light-300-alpha-500);
    cursor: pointer;
  }
}

.weekdays {
  display: flex;
  flex-flow: column nowrap;
  gap: 6px;
  font-size: 12px;
  color: var(--color-font-label);
}

.weekdayList {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 5px;

  button {
    height: 28px;
    min-width: 0;
    border: none;
    border-radius: 8px;
    color: var(--color-font-label);
    background: var(--color-primary-light-300-alpha-500);
    cursor: pointer;
    transition: color @transition-fast, background-color @transition-fast;

    &.weekdaySelected {
      color: #fff;
      background: var(--color-primary);
    }
  }
}

.inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.inputs label,
.clockInput {
  min-width: 0;
  display: flex;
  flex-flow: column nowrap;
  gap: 5px;
  font-size: 12px;
  color: var(--color-font-label);

  input {
    height: 32px;
    border: none;
    border-radius: 8px;
    padding: 0 9px;
    color: var(--color-button-font);
    background: rgba(255, 255, 255, .94);
    box-shadow: inset 0 0 0 1px var(--color-primary-light-300-alpha-400);
    outline: none;
    box-sizing: border-box;
  }
}

.hint,
.summary {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-font-label);
}

.summary {
  min-height: 34px;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--color-font);
  background: var(--color-primary-light-300-alpha-500);
  box-sizing: border-box;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
