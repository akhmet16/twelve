import { useState, useMemo } from 'react'

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

function getWeekDays() {
  const today = new Date()
  const dow = today.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function dateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function DeadlineBadge({ deadline }) {
  if (!deadline) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(deadline + 'T00:00:00')

  const colorClass = d < today
    ? 'text-red-500'
    : d.getTime() === today.getTime()
      ? 'text-orange-500'
      : 'text-text-muted'

  return (
    <span className={`text-xs shrink-0 ${colorClass}`}>
      {d.getDate()} {MONTHS[d.getMonth()]}
    </span>
  )
}

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1.5,5 4,7.5 8.5,2.5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
    </svg>
  )
}

export default function WeekView() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('twelve-week-tasks') || '{}') }
    catch { return {} }
  })
  const [goals] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('twelve-year') || 'null')
      return data?.goals || []
    } catch { return [] }
  })
  const [activeInput, setActiveInput] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [inputDeadline, setInputDeadline] = useState('')
  const [inputGoal, setInputGoal] = useState(null)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const days = useMemo(() => getWeekDays(), [])

  function saveTasks(next) {
    setTasks(next)
    localStorage.setItem('twelve-week-tasks', JSON.stringify(next))
  }

  function openInput(key) {
    setInputValue('')
    setInputDeadline('')
    setInputGoal(null)
    setActiveInput(key)
  }

  function commitInput(key) {
    const text = inputValue.trim()
    if (text) {
      saveTasks({
        ...tasks,
        [key]: [...(tasks[key] || []), {
          id: Date.now(), text, done: false,
          deadline: inputDeadline || null,
          goalIndex: inputGoal,
        }],
      })
    }
    setActiveInput(null)
    setInputValue('')
    setInputDeadline('')
    setInputGoal(null)
  }

  function toggleTask(key, id) {
    saveTasks({ ...tasks, [key]: tasks[key].map(t => t.id === id ? { ...t, done: !t.done } : t) })
  }

  function deleteTask(key, id) {
    saveTasks({ ...tasks, [key]: tasks[key].filter(t => t.id !== id) })
  }

  function handleInputBlur(key, e) {
    if (!e.currentTarget.contains(e.relatedTarget)) commitInput(key)
  }

  function handleEscape() {
    setActiveInput(null)
    setInputValue('')
    setInputDeadline('')
    setInputGoal(null)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl px-10 pb-10">
        {days.map(day => {
          const key = dateKey(day)
          const isPast = day < today
          const isToday = day.getTime() === today.getTime()
          const dayTasks = tasks[key] || []

          const weekday = day.toLocaleDateString('ru-RU', { weekday: 'long' })
          const dayName = weekday.charAt(0).toUpperCase() + weekday.slice(1)
          const dayDate = day.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })

          return (
            <div key={key} className={`mb-7 transition-opacity ${isPast ? 'opacity-35' : ''}`}>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs text-text-muted w-14 shrink-0">{dayDate}</span>
                <span className={`text-sm font-semibold ${isToday ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {dayName}
                </span>
                {isToday && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
              </div>

              <div className="pl-[68px]">
                {dayTasks.map(task => (
                  <div key={task.id} className="group flex items-center gap-2.5 py-[5px]">
                    <button
                      onClick={() => toggleTask(key, task.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors duration-100 cursor-default
                        ${task.done ? 'bg-accent border-accent' : 'border-text-muted hover:border-text-secondary'}`}
                    >
                      {task.done && <CheckIcon />}
                    </button>
                    <span className={`text-sm flex-1 select-text ${task.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                      {task.text}
                    </span>
                    <DeadlineBadge deadline={task.deadline} />
                    {task.goalIndex != null && goals[task.goalIndex] && (
                      <span className="text-[10px] text-accent/70 shrink-0 max-w-[72px] truncate">
                        {goals[task.goalIndex]}
                      </span>
                    )}
                    <button
                      onClick={() => deleteTask(key, task.id)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 transition-all duration-100 cursor-default shrink-0"
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}

                {activeInput === key ? (
                  <div
                    className="flex items-center gap-2.5 py-[5px]"
                    onBlur={e => handleInputBlur(key, e)}
                  >
                    <div className="w-4 h-4 rounded border border-border shrink-0" />
                    <input
                      autoFocus
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitInput(key)
                        if (e.key === 'Escape') handleEscape()
                      }}
                      placeholder="Новая задача..."
                      className="flex-1 text-sm bg-transparent outline-none text-text-primary placeholder:text-text-muted"
                      style={{ userSelect: 'text' }}
                    />
                    <input
                      type="date"
                      value={inputDeadline}
                      onChange={e => setInputDeadline(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitInput(key)
                        if (e.key === 'Escape') handleEscape()
                      }}
                      tabIndex={0}
                      className="text-xs text-text-secondary bg-transparent outline-none w-28"
                    />
                    {goals.length > 0 && (
                      <select
                        value={inputGoal ?? ''}
                        onChange={e => setInputGoal(e.target.value === '' ? null : Number(e.target.value))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitInput(key)
                          if (e.key === 'Escape') handleEscape()
                        }}
                        tabIndex={0}
                        className="text-xs text-text-secondary bg-transparent outline-none cursor-default max-w-[90px]"
                      >
                        <option value="">Без цели</option>
                        {goals.map((g, i) => (
                          <option key={i} value={i}>{g}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openInput(key)}
                    className="flex items-center gap-1.5 py-[5px] text-text-muted hover:text-text-secondary transition-colors duration-100 cursor-default text-sm"
                  >
                    <span className="text-base leading-none">+</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
