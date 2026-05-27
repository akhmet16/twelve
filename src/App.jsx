import { useState } from 'react'
import Sidebar from './components/Sidebar'
import PlaceholderView from './views/PlaceholderView'
import WeekView from './views/WeekView'

const TABS = {
  today:    'Сегодня',
  tomorrow: 'Завтра',
  week:     'Неделя',
  twelve:   '12 недель',
  vision:   'Видение',
}

export default function App() {
  const [activeTab, setActiveTab] = useState('twelve')

  return (
    <div className="flex h-screen w-screen bg-bg-primary overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 h-full overflow-hidden">
        {activeTab === 'week'
          ? <WeekView />
          : <PlaceholderView title={TABS[activeTab]} />
        }
      </main>
    </div>
  )
}
