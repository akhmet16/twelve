import { useState, useMemo } from 'react'

const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const MONTHS_NOM = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDate(str) {
  return new Date(str + 'T00:00:00')
}

function addDays(dateStr, n) {
  const d = parseDate(dateStr)
  d.setDate(d.getDate() + n)
  return dateKey(d)
}

function formatLong(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${d} ${MONTHS_GEN[m - 1]} ${y}`
}

function readAllTasks() {
  const all = []
  try {
    const todayTasks = JSON.parse(localStorage.getItem('twelve-today-tasks') || '[]')
    const tomorrowTasks = JSON.parse(localStorage.getItem('twelve-tomorrow-tasks') || '[]')
    const weekRaw = JSON.parse(localStorage.getItem('twelve-week-tasks') || '{}')
    all.push(...todayTasks, ...tomorrowTasks, ...Object.values(weekRaw).flat())
  } catch {}
  return all
}

function MiniCalendar({ startDate, endDate, todayStr }) {
  const startD = useMemo(() => parseDate(startDate), [startDate])
  const endD = useMemo(() => parseDate(endDate), [endDate])

  const [viewYear, setViewYear] = useState(() => parseDate(todayStr).getFullYear())
  const [viewMonth, setViewMonth] = useState(() => parseDate(todayStr).getMonth())

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function buildCells(year, month) {
    let dow = new Date(year, month, 1).getDay()
    if (dow === 0) dow = 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = Array(dow - 1).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }

  const cells = buildCells(viewYear, viewMonth)

  return (
    <div className="w-48 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors cursor-default text-base leading-none"
        >
          ‹
        </button>
        <span className="text-[11px] text-text-secondary">
          {MONTHS_NOM[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors cursor-default text-base leading-none"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-0.5">
        {WDAYS.map(w => (
          <div key={w} className="text-center text-[9px] text-text-muted py-0.5">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />

          const d = new Date(viewYear, viewMonth, day)
          const dk = dateKey(d)
          const isStart = dk === startDate
          const isEnd = dk === endDate
          const isToday = dk === todayStr
          const inRange = d > startD && d < endD

          let cls = 'relative flex items-center justify-center text-[11px] h-6 w-6 mx-auto rounded-full '
          if (isStart) cls += 'bg-accent text-white font-medium'
          else if (isEnd) cls += 'bg-orange-400 text-white font-medium'
          else if (inRange) cls += 'bg-accent/10 text-text-primary'
          else if (isToday) cls += 'text-accent font-semibold'
          else cls += 'text-text-secondary'

          return (
            <div key={i} className="flex items-center justify-center py-0.5">
              <div className={cls}>
                {day}
                {isToday && !isStart && !isEnd && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DashboardScreen({ yearData, todayStr }) {
  const { goals, startDate, endDate } = yearData

  const startD = useMemo(() => parseDate(startDate), [startDate])
  const todayD = useMemo(() => parseDate(todayStr), [todayStr])

  const weekNum = useMemo(() => {
    if (todayD < startD) return 1
    const days = Math.floor((todayD - startD) / 86400000)
    return Math.min(12, Math.floor(days / 7) + 1)
  }, [startD, todayD])

  const { weekStart, weekEnd } = useMemo(() => ({
    weekStart: addDays(startDate, (weekNum - 1) * 7),
    weekEnd: addDays(startDate, weekNum * 7 - 1),
  }), [startDate, weekNum])

  const daysPassed = useMemo(() => {
    const raw = Math.floor((todayD - startD) / 86400000)
    return Math.max(0, Math.min(84, raw))
  }, [startD, todayD])

  const daysRemaining = Math.max(0, 84 - daysPassed)

  const allTasks = useMemo(() => readAllTasks(), [])

  const goalStats = useMemo(() => goals.map((_, i) => {
    const gt = allTasks.filter(t => t.goalIndex === i)
    const done = gt.filter(t => t.done).length
    return { done, total: gt.length, pct: gt.length > 0 ? Math.round(done / gt.length * 100) : 0 }
  }), [allTasks, goals])

  const completedGoalTasks = useMemo(() =>
    allTasks.filter(t => t.done && t.goalIndex != null).length,
    [allTasks]
  )

  const weekRangeStr = useMemo(() => {
    const [, sm, sd] = weekStart.split('-').map(Number)
    const [, em, ed] = weekEnd.split('-').map(Number)
    if (sm === em) return `${sd}–${ed} ${MONTHS_GEN[sm - 1]}`
    return `${sd} ${MONTHS_GEN[sm - 1]} — ${ed} ${MONTHS_GEN[em - 1]}`
  }, [weekStart, weekEnd])

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-10 pb-10 max-w-2xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-4xl font-bold text-text-primary leading-none mb-1.5">
              Неделя {weekNum}
            </div>
            <div className="text-sm text-text-muted">{weekRangeStr}</div>
          </div>
          <MiniCalendar startDate={startDate} endDate={endDate} todayStr={todayStr} />
        </div>

        <div className="flex gap-8 mb-8 pb-7 border-b border-border">
          <div>
            <div className="text-xs text-text-muted mb-1">Прошло дней</div>
            <div className="text-2xl font-semibold text-text-primary leading-none">
              {daysPassed}
              <span className="text-sm font-normal text-text-muted ml-1.5">из 84</span>
            </div>
          </div>
          <div className="w-px bg-border self-stretch" />
          <div>
            <div className="text-xs text-text-muted mb-1">Осталось дней</div>
            <div className="text-2xl font-semibold text-text-primary leading-none">{daysRemaining}</div>
          </div>
          <div className="w-px bg-border self-stretch" />
          <div>
            <div className="text-xs text-text-muted mb-1">Выполнено задач</div>
            <div className="text-2xl font-semibold text-text-primary leading-none">{completedGoalTasks}</div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {goals.map((goal, i) => {
            const { done, total, pct } = goalStats[i]
            return (
              <div key={i}>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{goal}</span>
                  <span className="text-sm text-text-muted">{pct}%</span>
                </div>
                <div className="w-full bg-bg-secondary h-1.5 rounded-full mb-1.5">
                  <div
                    className="bg-accent h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-text-muted">
                  {done} из {total} задач выполнено
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function OnboardingScreen({ onSave }) {
  const [goals, setGoals] = useState(['', '', ''])
  const [startDate, setStartDate] = useState('')

  const endDate = startDate ? addDays(startDate, 83) : null
  const canStart = goals[0].trim() !== '' && startDate !== ''

  function handleSave() {
    if (!canStart) return
    const data = { goals: goals.filter(g => g.trim()), startDate, endDate }
    localStorage.setItem('twelve-year', JSON.stringify(data))
    onSave(data)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-10 pb-10">
        <p className="text-sm text-text-secondary mb-7">Поставь до 3 целей которых хочешь достичь</p>

        <div className="flex flex-col gap-2.5 mb-7 max-w-xs">
          {[0, 1, 2].map(i => (
            <input
              key={i}
              value={goals[i]}
              onChange={e => { const n = [...goals]; n[i] = e.target.value; setGoals(n) }}
              onKeyDown={e => { if (e.key === 'Enter' && canStart) handleSave() }}
              placeholder={i === 0 ? 'Цель 1' : `Цель ${i + 1} (необязательно)`}
              className="w-full text-sm bg-bg-secondary border border-border rounded-lg px-3 py-2.5 outline-none text-text-primary placeholder:text-text-muted focus:border-accent transition-colors"
              style={{ userSelect: 'text' }}
            />
          ))}
        </div>

        <div className="flex items-end gap-6 mb-7">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted">Дата начала</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="text-sm bg-bg-secondary border border-border rounded-lg px-3 py-2 outline-none text-text-primary focus:border-accent transition-colors cursor-default"
            />
          </div>
          {endDate && (
            <div className="flex flex-col gap-1.5 pb-[9px]">
              <span className="text-xs text-text-muted">Дата окончания</span>
              <span className="text-sm text-text-secondary">{formatLong(endDate)}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!canStart}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-default
            ${canStart
              ? 'bg-accent text-white hover:bg-blue-600 active:bg-blue-700'
              : 'bg-bg-secondary text-text-muted'}`}
        >
          Начать 12-недельный год
        </button>
      </div>
    </div>
  )
}

export default function TwelveView() {
  const [yearData, setYearData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('twelve-year') || 'null') }
    catch { return null }
  })

  const todayStr = useMemo(() => dateKey(new Date()), [])

  if (!yearData) return <OnboardingScreen onSave={setYearData} />
  return <DashboardScreen yearData={yearData} todayStr={todayStr} />
}
