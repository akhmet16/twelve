import { useState } from 'react'

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1.5,5 4,7.5 8.5,2.5" />
    </svg>
  )
}

export default function TaskDetailPanel({ task, onUpdate, onDelete, onClose }) {
  const [title, setTitle]       = useState(task.text)
  const [notes, setNotes]       = useState(task.notes || '')
  const [deadline, setDeadline] = useState(task.deadline || '')
  const [goalIndex, setGoalIndex] = useState(task.goalIndex ?? null)
  const [done, setDone]         = useState(task.done)

  const [goals] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('twelve-year') || 'null')
      return data?.goals || []
    } catch { return [] }
  })

  return (
    <div
      data-detailpanel="true"
      className="w-80 h-full flex flex-col border-l border-border bg-bg-primary shrink-0"
    >
      {/* Close */}
      <div className="flex items-center justify-end px-4 pt-4 shrink-0">
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:bg-bg-hover hover:text-text-secondary transition-colors cursor-default text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <textarea
          value={title}
          onChange={e => { setTitle(e.target.value); onUpdate({ text: e.target.value }) }}
          rows={2}
          className="w-full text-[17px] font-semibold bg-transparent outline-none resize-none text-text-primary mb-4 leading-snug"
          style={{ userSelect: 'text' }}
        />

        <div className="h-px bg-border mb-4" />

        <textarea
          value={notes}
          onChange={e => { setNotes(e.target.value); onUpdate({ notes: e.target.value }) }}
          placeholder="Заметки..."
          rows={6}
          className="w-full text-sm bg-transparent outline-none resize-none text-text-primary placeholder:text-text-muted mb-4 leading-relaxed"
          style={{ userSelect: 'text' }}
        />

        <div className="h-px bg-border mb-4" />

        {/* Deadline */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-text-muted w-16 shrink-0">Дедлайн</span>
          <input
            type="date"
            value={deadline}
            onChange={e => {
              setDeadline(e.target.value)
              onUpdate({ deadline: e.target.value || null })
            }}
            className="text-sm text-text-secondary bg-transparent outline-none cursor-default flex-1"
          />
        </div>

        {/* Goal */}
        {goals.length > 0 && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-text-muted w-16 shrink-0">Цель</span>
            <select
              value={goalIndex ?? ''}
              onChange={e => {
                const val = e.target.value === '' ? null : Number(e.target.value)
                setGoalIndex(val)
                onUpdate({ goalIndex: val })
              }}
              className="text-sm text-text-secondary bg-transparent outline-none cursor-default flex-1"
            >
              <option value="">Без цели</option>
              {goals.map((g, i) => (
                <option key={i} value={i}>{g}</option>
              ))}
            </select>
          </div>
        )}

        {/* Done */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted w-16 shrink-0">Статус</span>
          <button
            onClick={() => {
              const next = !done
              setDone(next)
              onUpdate({ done: next })
            }}
            className="flex items-center gap-2 cursor-default"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors duration-100
              ${done ? 'bg-accent border-accent' : 'border-text-muted hover:border-text-secondary'}`}>
              {done && <CheckIcon />}
            </div>
            <span className="text-sm text-text-secondary">Выполнено</span>
          </button>
        </div>
      </div>

      {/* Delete */}
      <div className="px-5 py-4 shrink-0 border-t border-border">
        <button
          onClick={() => { onDelete(); onClose() }}
          className="text-sm text-red-500 hover:text-red-400 transition-colors cursor-default"
        >
          Удалить задачу
        </button>
      </div>
    </div>
  )
}
