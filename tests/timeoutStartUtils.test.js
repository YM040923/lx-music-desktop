const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const ts = require('typescript')

const loadModule = () => {
  const file = path.join(__dirname, '..', 'src', 'renderer', 'core', 'player', 'timeoutStartUtils.ts')
  const source = fs.readFileSync(file, 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  })
  const module = { exports: {} }
  const fn = new Function('module', 'exports', outputText)
  fn(module, module.exports)
  return module.exports
}

test('duration timer converts hours and minutes to seconds', () => {
  const { getDelaySecondsByDuration } = loadModule()

  assert.equal(getDelaySecondsByDuration(1, 30), 5400)
  assert.equal(getDelaySecondsByDuration(0.5, 0), 1800)
  assert.equal(getDelaySecondsByDuration(0, 15), 900)
})

test('duration timer rejects empty or non-positive duration', () => {
  const { getDelaySecondsByDuration } = loadModule()

  assert.equal(getDelaySecondsByDuration(0, 0), 0)
  assert.equal(getDelaySecondsByDuration(-1, 30), 0)
})

test('clock timer schedules today when Beijing time is still ahead', () => {
  const { getDelaySecondsByBeijingClock } = loadModule()
  const now = Date.UTC(2026, 5, 7, 1, 30, 0)

  assert.equal(getDelaySecondsByBeijingClock('10:00', now), 1800)
})

test('clock timer schedules tomorrow when Beijing time has passed today', () => {
  const { getDelaySecondsByBeijingClock } = loadModule()
  const now = Date.UTC(2026, 5, 7, 15, 30, 0)

  assert.equal(getDelaySecondsByBeijingClock('22:00', now), 81000)
})

test('weekly clock timer schedules today when selected weekday is still ahead', () => {
  const { getDelaySecondsByBeijingClockWeekdays } = loadModule()
  const now = Date.UTC(2026, 5, 7, 1, 30, 0)

  assert.equal(getDelaySecondsByBeijingClockWeekdays('10:00', [7], now), 1800)
})

test('weekly clock timer schedules next selected weekday after time has passed', () => {
  const { getDelaySecondsByBeijingClockWeekdays } = loadModule()
  const now = Date.UTC(2026, 5, 7, 15, 30, 0)

  assert.equal(getDelaySecondsByBeijingClockWeekdays('22:00', [1, 3], now), 81000)
})

test('weekly clock timer schedules next week when only today is selected and time has passed', () => {
  const { getDelaySecondsByBeijingClockWeekdays } = loadModule()
  const now = Date.UTC(2026, 5, 7, 15, 30, 0)

  assert.equal(getDelaySecondsByBeijingClockWeekdays('22:00', [7], now), 599400)
})

test('timer labels use compact Chinese-friendly text', () => {
  const { formatCountdownLabel, formatClockLabel } = loadModule()

  assert.equal(formatCountdownLabel(3661), '1:01:01')
  assert.equal(formatCountdownLabel(59), '00:59')
  assert.equal(formatClockLabel(Date.UTC(2026, 5, 7, 23, 5, 0)), '07:05')
})
