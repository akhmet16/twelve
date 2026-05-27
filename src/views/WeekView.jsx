import { useState, useMemo } from 'react'

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

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1.5,5 4,7.5 8.5,2.5" />
    </svg>
  )
}

export default function WeekView() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('twelve-week-tasks') || '{}') }
    catch { return {} }
  })
  const [activeInput, setActiveInput] = useState(null)
  const [inputValue, setInputValue] = useState('')

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
    setActiveInput(key)
  }

  function commitInput(key) {
    const text = inputValue.trim()
    if (text) {
      saveTasks({
        ...tasks,
        [key]: [...(tasks[key] || []), { id: Date.now(), text, done: false }],
      })
    }
    setActiveInput(null)
    setInputValue('')
  }

  function toggleTask(key, id) {
    saveTasks({
      ...tasks,
      [key]: tasks[key].map(t => t.id === id ? { ...t, done: !t.done } : t),
    })
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl px-10 py-8">
        {days.map(day => {
          const key = dateKey(day)
          const isPast = day < today
          const isToday = day.getTime() === today.getTime()
          const dayTasks = tasks[key] || []

          const weekday = day.toLocaleDateString('ru-RU', { weekday: 'long' })
          const dayName = weekday.charAt(0).toUpperCase() + weekday.slice(1)
          const dayDate = day.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })

          return (
            <div
              key={key}
              className={`mb-7 transition-opacity ${isPast ? 'opacity-35' : ''}`}
            >
              {/* Day header */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-text-muted w-14 shrink-0">{dayDate}</span>
                <span className={`text-sm font-semibold ${isToday ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {dayName}
                </span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                )}
              </div>

              {/* Tasks */}
              <div className="pl-[68px] flex flex-col gap-0.5">
                {dayTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 py-0.5">
                    <button
                      onClick={() => toggleTask(key, task.id)}
                      className={`
                        w-4 h-4 rounded border flex items-center justify-center shrink-0
                        transition-colors duration-100
                        ${task.done
                          ? 'bg-accent border-accent'
                          : 'border-text-muted hover:border-text-secondary'
                        }
                      `}
                    >
                      {task.done && <CheckIcon />}
                    </button>
                    <span className={`text-sm select-text ${task.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}

                {/* Inline input or add button */}
                {activeInput === key ? (
                  <div className="flex items-center gap-2 py-0.5">
                    <div className="w-4 h-4 rounded border border-text-muted shrink-0" />
                    <input
                      autoFocus
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitInput(key)
                        if (e.key === 'Escape') { setActiveInput(null); setInputValue('') }
                      }}
                      onBlur={() => commitInput(key)}
                      placeholder="Новая задача..."
                      className="text-sm bg-transparent outline-none border-none text-text-primary placeholder:text-text-muted w-full"
                      style={{ userSelect: 'text' }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => !isPast && openInput(key)}
                    className="flex items-center gap-1.5 py-0.5 text-text-muted hover:text-text-secondary transition-colors duration-100 cursor-default text-sm"
                  >
                    <span className="text-base leading-none font-light">+</span>
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
