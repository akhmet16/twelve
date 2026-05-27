import { useState } from 'react'

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

function formatDeadline(iso) {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
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

  return <span className={`text-xs shrink-0 ${colorClass}`}>{formatDeadline(deadline)}</span>
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

export default function TaskList({ storageKey }) {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') }
    catch { return [] }
  })
  const [inputOpen, setInputOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [inputDeadline, setInputDeadline] = useState('')

  function save(next) {
    setTasks(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  function addTask() {
    const text = inputText.trim()
    if (text) {
      save([...tasks, { id: Date.now(), text, done: false, deadline: inputDeadline || null }])
    }
    setInputOpen(false)
    setInputText('')
    setInputDeadline('')
  }

  function toggleTask(id) {
    save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id) {
    save(tasks.filter(t => t.id !== id))
  }

  function handleWrapperBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) addTask()
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-10 pb-10">
        {tasks.map(task => (
          <div key={task.id} className="group flex items-center gap-3 py-[7px] border-b border-border">
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-[18px] h-[18px] rounded border flex items-center justify-center shrink-0 transition-colors duration-100 cursor-default
                ${task.done ? 'bg-accent border-accent' : 'border-text-muted hover:border-text-secondary'}`}
            >
              {task.done && <CheckIcon />}
            </button>

            <span className={`text-sm flex-1 leading-relaxed select-text
              ${task.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
              {task.text}
            </span>

            <DeadlineBadge deadline={task.deadline} />

            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 transition-all duration-100 cursor-default shrink-0"
            >
              <XIcon />
            </button>
          </div>
        ))}

        {inputOpen ? (
          <div
            className="flex items-center gap-3 py-[7px] border-b border-border"
            onBlur={handleWrapperBlur}
          >
            <div className="w-[18px] h-[18px] rounded border border-border shrink-0" />
            <input
              autoFocus
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addTask()
                if (e.key === 'Escape') { setInputOpen(false); setInputText(''); setInputDeadline('') }
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
                if (e.key === 'Enter') addTask()
                if (e.key === 'Escape') { setInputOpen(false); setInputText(''); setInputDeadline('') }
              }}
              tabIndex={0}
              className="text-xs text-text-secondary bg-transparent outline-none w-28"
            />
          </div>
        ) : (
          <button
            onClick={() => setInputOpen(true)}
            className="flex items-center gap-2 py-[7px] text-text-muted hover:text-text-secondary transition-colors duration-100 cursor-default text-sm mt-0.5"
          >
            <span className="text-lg leading-none">+</span>
            <span>Новая задача</span>
          </button>
        )}
      </div>
    </div>
  )
}
