import TaskList from '../components/TaskList'

export default function TodayView({ onSelectTask }) {
  return <TaskList storageKey="twelve-today-tasks" onSelectTask={onSelectTask} />
}
