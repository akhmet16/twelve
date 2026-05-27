import { useState, useLayoutEffect, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import PlaceholderView from './views/PlaceholderView'
import WeekView from './views/WeekView'
import TodayView from './views/TodayView'
import TomorrowView from './views/TomorrowView'
import TwelveView from './views/TwelveView'
import TaskDetailPanel from './components/TaskDetailPanel'

const TABS = {
  today:    'Сегодня',
  tomorrow: 'Завтра',
  week:     'Неделя',
  twelve:   '12 недель',
  vision:   'Видение',
}

function renderView(tab, onSelectTask) {
  switch (tab) {
    case 'today':    return <TodayView onSelectTask={onSelectTask} />
    case 'tomorrow': return <TomorrowView onSelectTask={onSelectTask} />
    case 'week':     return <WeekView onSelectTask={onSelectTask} />
    case 'twelve':   return <TwelveView />
    default:         return <PlaceholderView />
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('today')
  const [theme, setTheme] = useState(() => localStorage.getItem('twelve-theme') || 'light')
  const [selectedTaskInfo, setSelectedTaskInfo] = useState(null)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('twelve-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!selectedTaskInfo) return
    function handleMouseDown(e) {
      if (!e.target.closest('[data-detailpanel]') && !e.target.closest('[data-taskrow]')) {
        setSelectedTaskInfo(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [selectedTaskInfo])

  function handleSelectTask(task, onUpdate, onDelete) {
    setSelectedTaskInfo({ task, onUpdate, onDelete })
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onThemeToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
      />
      <main className="flex-1 h-full overflow-hidden flex bg-bg-primary">
        <div className="flex-1 h-full overflow-hidden flex flex-col min-w-0">
          <div className="px-10 pt-12 pb-4 shrink-0">
            <h1 className="text-[28px] font-bold text-text-primary tracking-tight leading-none">
              {TABS[activeTab]}
            </h1>
          </div>
          <div className="flex-1 overflow-hidden">
            {renderView(activeTab, handleSelectTask)}
          </div>
        </div>
        {selectedTaskInfo && (
          <TaskDetailPanel
            key={selectedTaskInfo.task.id}
            task={selectedTaskInfo.task}
            onUpdate={selectedTaskInfo.onUpdate}
            onDelete={selectedTaskInfo.onDelete}
            onClose={() => setSelectedTaskInfo(null)}
          />
        )}
      </main>
    </div>
  )
}
