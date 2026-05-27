import { useState } from 'react'
import Sidebar from './components/Sidebar'
import PlaceholderView from './views/PlaceholderView'
import WeekView from './views/WeekView'
import TodayView from './views/TodayView'
import TomorrowView from './views/TomorrowView'
import TwelveView from './views/TwelveView'

const TABS = {
  today:    'Сегодня',
  tomorrow: 'Завтра',
  week:     'Неделя',
  twelve:   '12 недель',
  vision:   'Видение',
}

function renderView(tab) {
  switch (tab) {
    case 'today':    return <TodayView />
    case 'tomorrow': return <TomorrowView />
    case 'week':     return <WeekView />
    case 'twelve':   return <TwelveView />
    default:         return <PlaceholderView />
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('today')

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 h-full overflow-hidden flex flex-col bg-bg-primary">
        <div className="px-10 pt-12 pb-4 shrink-0">
          <h1 className="text-[28px] font-bold text-text-primary tracking-tight leading-none">
            {TABS[activeTab]}
          </h1>
        </div>
        <div className="flex-1 overflow-hidden">
          {renderView(activeTab)}
        </div>
      </main>
    </div>
  )
}
