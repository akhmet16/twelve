import TaskList from '../components/TaskList'

export default function TomorrowView({ onSelectTask }) {
  return <TaskList storageKey="twelve-tomorrow-tasks" onSelectTask={onSelectTask} />
}
