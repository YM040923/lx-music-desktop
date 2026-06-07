import { ref, computed, type ComputedRef } from '@common/utils/vueTools'
import { playMusicInfo } from '@renderer/store/player/state'
import { play } from './action'
import { formatClockLabel, formatCountdownLabel, getDelaySecondsByBeijingClockWeekdays } from './timeoutStartUtils'

interface TimeoutStartRepeat {
  clock: string
  weekdays: number[]
}

const time = ref(-1)
const targetTime = ref(0)
const repeatWeekdays = ref<number[]>([])

const timeoutTools: {
  isRunning: boolean
  interval: null | number
  timeout: NodeJS.Timeout | null
  endTime: number
  repeat: TimeoutStartRepeat | null
  exit: () => void
  clearTimeout: () => void
  start: (_time: number, repeat?: TimeoutStartRepeat | null) => void
} = {
  isRunning: false,
  timeout: null,
  endTime: 0,
  interval: null,
  repeat: null,
  exit() {
    if (playMusicInfo.musicInfo) play()
    if (this.repeat) {
      const delay = getDelaySecondsByBeijingClockWeekdays(this.repeat.clock, this.repeat.weekdays, Date.now() + 1000)
      this.start(delay, this.repeat)
    }
  },
  clearTimeout() {
    if (this.interval) {
      window.clearInterval(this.interval)
      this.interval = null
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }

    if (!this.isRunning) return
    time.value = -1
    targetTime.value = 0
    repeatWeekdays.value = []
    this.isRunning = false
  },
  start(_time: number, repeat = null) {
    this.clearTimeout()
    if (_time <= 0) return

    this.repeat = repeat
    repeatWeekdays.value = repeat?.weekdays ?? []
    time.value = _time
    this.isRunning = true
    this.endTime = performance.now() + _time * 1000
    targetTime.value = Date.now() + _time * 1000

    this.interval = window.setInterval(() => {
      time.value = Math.max(0, Math.round((this.endTime - performance.now()) / 1000))
    }, 1000)
    this.timeout = setTimeout(() => {
      this.timeout = null
      this.clearTimeout()
      this.exit()
    }, _time * 1000)
  },
}

export const startTimeoutStart = (time: number) => {
  timeoutTools.start(time)
}

export const startTimeoutStartRepeat = (time: number, clock: string, weekdays: number[]) => {
  timeoutTools.start(time, weekdays.length ? { clock, weekdays } : null)
}

export const stopTimeoutStart = () => {
  timeoutTools.repeat = null
  timeoutTools.clearTimeout()
}

export const useTimeoutStart = () => {
  const timeLabel: ComputedRef<string> = computed(() => {
    return time.value > 0 ? formatCountdownLabel(time.value) : ''
  })
  const targetTimeLabel: ComputedRef<string> = computed(() => {
    return targetTime.value > 0 ? formatClockLabel(targetTime.value) : ''
  })

  return {
    time,
    targetTime,
    repeatWeekdays,
    timeLabel,
    targetTimeLabel,
  }
}
