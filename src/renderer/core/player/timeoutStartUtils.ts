const BEIJING_UTC_OFFSET_HOURS = 8
const DAY_SECONDS = 24 * 60 * 60

const toSafeNumber = (value: number) => Number.isFinite(value) ? value : 0

export const getDelaySecondsByDuration = (hours: number, minutes: number): number => {
  const totalSeconds = Math.round((toSafeNumber(hours) * 60 * 60) + (toSafeNumber(minutes) * 60))
  return Math.max(0, totalSeconds)
}

export const getDelaySecondsByBeijingClock = (clock: string, now = Date.now()): number => {
  const matched = /^(\d{1,2}):(\d{1,2})$/.exec(clock.trim())
  if (!matched) return 0

  const hour = Number(matched[1])
  const minute = Number(matched[2])
  if (hour > 23 || minute > 59) return 0

  const nowDate = new Date(now)
  const beijingHour = (nowDate.getUTCHours() + BEIJING_UTC_OFFSET_HOURS) % 24
  const nowSeconds = beijingHour * 60 * 60 + nowDate.getUTCMinutes() * 60 + nowDate.getUTCSeconds()
  const targetSeconds = hour * 60 * 60 + minute * 60
  const delay = targetSeconds - nowSeconds

  return delay > 0 ? delay : delay + DAY_SECONDS
}

const getBeijingWeekday = (time: number): number => {
  const day = new Date(time + BEIJING_UTC_OFFSET_HOURS * 60 * 60 * 1000).getUTCDay()
  return day == 0 ? 7 : day
}

export const getDelaySecondsByBeijingClockWeekdays = (clock: string, weekdays: number[], now = Date.now()): number => {
  const matched = /^(\d{1,2}):(\d{1,2})$/.exec(clock.trim())
  if (!matched) return 0

  const hour = Number(matched[1])
  const minute = Number(matched[2])
  if (hour > 23 || minute > 59) return 0

  const validWeekdays = Array.from(new Set(weekdays.filter(day => day >= 1 && day <= 7)))
  if (!validWeekdays.length) return getDelaySecondsByBeijingClock(clock, now)

  const nowDate = new Date(now)
  const beijingHour = (nowDate.getUTCHours() + BEIJING_UTC_OFFSET_HOURS) % 24
  const nowSeconds = beijingHour * 60 * 60 + nowDate.getUTCMinutes() * 60 + nowDate.getUTCSeconds()
  const targetSeconds = hour * 60 * 60 + minute * 60
  const today = getBeijingWeekday(now)

  for (let offset = 0; offset <= 7; offset++) {
    const weekday = ((today + offset - 1) % 7) + 1
    if (!validWeekdays.includes(weekday)) continue
    const delay = offset * DAY_SECONDS + targetSeconds - nowSeconds
    if (delay > 0) return delay
  }

  return 0
}

export const formatCountdownLabel = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.round(seconds))
  const h = Math.trunc(safeSeconds / 3600)
  const m = Math.trunc((safeSeconds % 3600) / 60).toString().padStart(2, '0')
  const s = Math.trunc(safeSeconds % 60).toString().padStart(2, '0')
  return h ? `${h}:${m}:${s}` : `${m}:${s}`
}

export const formatClockLabel = (time: number): string => {
  const date = new Date(time + BEIJING_UTC_OFFSET_HOURS * 60 * 60 * 1000)
  const h = date.getUTCHours().toString().padStart(2, '0')
  const m = date.getUTCMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}
